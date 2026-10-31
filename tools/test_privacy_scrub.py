import contextlib
import io
import json
import os
import tempfile
import unittest
from pathlib import Path

import privacy_scrub


class PrivacyScrubParallelTests(unittest.TestCase):
    def test_parallel_scrub_cleans_html_text_and_preserves_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for n in range(8):
                (root / f"page-{n}.html").write_text(
                    f"<p>Compiled by Tab agent. Page {n}</p>", encoding="utf-8"
                )
            data = root / "catalogue.json"
            data.write_text(
                json.dumps({"note": "Compiled by Tab agent"}), encoding="utf-8"
            )

            old_workers = os.environ.get("PRIVACY_WORKERS")
            os.environ["PRIVACY_WORKERS"] = "2"
            try:
                output = io.StringIO()
                with contextlib.redirect_stdout(output):
                    result = privacy_scrub.main(root)
            finally:
                if old_workers is None:
                    os.environ.pop("PRIVACY_WORKERS", None)
                else:
                    os.environ["PRIVACY_WORKERS"] = old_workers

            self.assertEqual(result, 0, output.getvalue())
            for n in range(8):
                text = (root / f"page-{n}.html").read_text(encoding="utf-8")
                self.assertIn("Compiled by Cedwyn editors", text)
                self.assertNotIn("Tab agent", text)
            parsed = json.loads(data.read_text(encoding="utf-8"))
            self.assertEqual(parsed["note"], "Compiled by Cedwyn editors")

    def test_check_only_fails_without_modifying_source(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "page.txt"
            original = "This was compiled by Tab agent."
            source.write_text(original, encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                result = privacy_scrub.main(root, check_only=True)
            self.assertEqual(result, 1)
            self.assertEqual(source.read_text(encoding="utf-8"), original)
            self.assertIn("remaining", output.getvalue())


if __name__ == "__main__":
    unittest.main()
