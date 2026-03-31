"""Management command to benchmark core SQL workloads for TrackEd."""
from __future__ import annotations

import json
import statistics
import time
from dataclasses import dataclass
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.db.models import Avg, Count

from apps.attendance.models import Attendance
from apps.marks.models import Marks
from apps.users.models import CustomUser


@dataclass
class BenchmarkResult:
    """Holds timings (ms) and summary stats for one benchmark operation."""

    name: str
    samples_ms: list[float]

    @property
    def avg_ms(self) -> float:
        return statistics.mean(self.samples_ms) if self.samples_ms else 0.0

    @property
    def median_ms(self) -> float:
        return statistics.median(self.samples_ms) if self.samples_ms else 0.0

    @property
    def p95_ms(self) -> float:
        if not self.samples_ms:
            return 0.0
        ordered = sorted(self.samples_ms)
        idx = max(0, min(len(ordered) - 1, int(round(0.95 * (len(ordered) - 1)))))
        return ordered[idx]


class Command(BaseCommand):
    help = (
        "Benchmark core SQL query workloads (users/attendance/marks) "
        "against a selected Django database alias."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--database",
            default="default",
            help="Database alias from Django DATABASES settings (default: default).",
        )
        parser.add_argument(
            "--iterations",
            type=int,
            default=20,
            help="Number of measurement iterations per query (default: 20).",
        )
        parser.add_argument(
            "--warmup",
            type=int,
            default=5,
            help="Warmup iterations per query before measurement (default: 5).",
        )
        parser.add_argument(
            "--output-json",
            default="",
            help="Optional file path to write benchmark results as JSON.",
        )

    def handle(self, *args, **options):
        database = options["database"]
        iterations = options["iterations"]
        warmup = options["warmup"]
        output_json = options["output_json"]

        if database not in connections:
            raise CommandError(f"Unknown database alias: {database}")
        if iterations <= 0:
            raise CommandError("--iterations must be greater than 0")
        if warmup < 0:
            raise CommandError("--warmup cannot be negative")

        db_settings = connections[database].settings_dict
        db_name = db_settings.get("NAME", "") or "<empty>"
        db_engine = db_settings.get("ENGINE", "") or "<empty>"
        db_host = db_settings.get("HOST", "") or "<empty>"
        db_port = str(db_settings.get("PORT", "") or "<empty>")
        db_user = db_settings.get("USER", "") or "<empty>"

        self.stdout.write(self.style.MIGRATE_HEADING("SQL Benchmark - TrackEd"))
        self.stdout.write(f"Database alias: {database}")
        self.stdout.write(f"Database name: {db_name}")
        self.stdout.write(f"Database engine: {db_engine}")
        self.stdout.write(f"Database host: {db_host}:{db_port}")
        self.stdout.write(f"Database user: {db_user}")
        self.stdout.write(f"Warmup: {warmup}, Iterations: {iterations}\n")

        operations = [
            (
                "student_count_by_department",
                lambda: list(
                    CustomUser.objects.using(database)
                    .filter(role=CustomUser.Role.STUDENT)
                    .values("department")
                    .annotate(total=Count("id"))
                    .order_by("department")
                ),
            ),
            (
                "attendance_30d_grouped_status",
                lambda: list(
                    Attendance.objects.using(database)
                    .values("status")
                    .annotate(total=Count("id"))
                    .order_by("status")
                ),
            ),
            (
                "top_10_students_average_marks",
                lambda: list(
                    Marks.objects.using(database)
                    .values("student_id")
                    .annotate(
                        avg_internal=Avg("internal_marks"),
                        avg_assignment=Avg("assignment_marks"),
                        avg_lab=Avg("lab_marks"),
                    )
                    .order_by("-avg_internal", "-avg_assignment", "-avg_lab")[:10]
                ),
            ),
            (
                "marks_join_student_subject_first100",
                lambda: list(
                    Marks.objects.using(database)
                    .select_related("student", "subject")
                    .all()[:100]
                ),
            ),
            (
                "attendance_join_student_subject_first200",
                lambda: list(
                    Attendance.objects.using(database)
                    .select_related("student", "subject")
                    .all()[:200]
                ),
            ),
        ]

        results: list[BenchmarkResult] = []
        for operation_name, operation in operations:
            samples = self._measure(operation, iterations=iterations, warmup=warmup)
            results.append(BenchmarkResult(name=operation_name, samples_ms=samples))

        self._print_results(results)
        self._print_summary(results)

        if output_json:
            self._write_json(
                output_json,
                database=database,
                db_name=db_name,
                db_engine=db_engine,
                db_host=db_host,
                db_port=db_port,
                db_user=db_user,
                warmup=warmup,
                iterations=iterations,
                results=results,
            )
            self.stdout.write(f"\nSaved JSON results to {output_json}")

    def _measure(self, fn, iterations: int, warmup: int) -> list[float]:
        for _ in range(warmup):
            fn()

        timings_ms: list[float] = []
        for _ in range(iterations):
            start = time.perf_counter()
            fn()
            elapsed_ms = (time.perf_counter() - start) * 1000
            timings_ms.append(round(elapsed_ms, 3))
        return timings_ms

    def _print_results(self, results: list[BenchmarkResult]) -> None:
        self.stdout.write("Benchmark Results (milliseconds)")
        self.stdout.write("-" * 78)
        self.stdout.write(f"{'Query':45} {'Avg':>8} {'Median':>8} {'P95':>8}")
        self.stdout.write("-" * 78)
        for item in results:
            self.stdout.write(
                f"{item.name:45} {item.avg_ms:8.2f} {item.median_ms:8.2f} {item.p95_ms:8.2f}"
            )
        self.stdout.write("-" * 78)

    def _print_summary(self, results: list[BenchmarkResult]) -> None:
        if not results:
            return
        overall_avg = statistics.mean([r.avg_ms for r in results])
        slowest = max(results, key=lambda r: r.avg_ms)
        fastest = min(results, key=lambda r: r.avg_ms)
        self.stdout.write("\nSummary")
        self.stdout.write(f"Overall mean query latency: {overall_avg:.2f} ms")
        self.stdout.write(f"Slowest query (by avg): {slowest.name} ({slowest.avg_ms:.2f} ms)")
        self.stdout.write(f"Fastest query (by avg): {fastest.name} ({fastest.avg_ms:.2f} ms)")

    def _write_json(
        self,
        output_path: str,
        *,
        database: str,
        db_name: str,
        db_engine: str,
        db_host: str,
        db_port: str,
        db_user: str,
        warmup: int,
        iterations: int,
        results: list[BenchmarkResult],
    ) -> None:
        payload = {
            "database_alias": database,
            "database_name": db_name,
            "database_engine": db_engine,
            "database_host": db_host,
            "database_port": db_port,
            "database_user": db_user,
            "warmup": warmup,
            "iterations": iterations,
            "results": [
                {
                    "query": r.name,
                    "avg_ms": round(r.avg_ms, 3),
                    "median_ms": round(r.median_ms, 3),
                    "p95_ms": round(r.p95_ms, 3),
                    "samples_ms": r.samples_ms,
                }
                for r in results
            ],
        }
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(payload, indent=2), encoding="utf-8")
