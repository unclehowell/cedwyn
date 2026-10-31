import hashlib
import tempfile
import unittest
from pathlib import Path

from dedupe_index import index_binary_files


class DedupeIndexTests(unittest.TestCase):
    def test_only_same_size_candidates_are_hashed_and_duplicates_are_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            a = root / "first.jpg"
            b = root / "same-bytes.png"
            c = root / "same-length-different-bytes.pdf"
            d = root / "unique-size.mp4"
            a.write_bytes(b"alpha")
            b.write_bytes(b"alpha")
            c.write_bytes(b"bravo")
            d.write_bytes(b"unique")

            indexed, metrics = index_binary_files([a, b, c, d], workers=2)
            digest = hashlib.sha256(b"alpha").hexdigest()

            self.assertEqual(indexed[digest], [a, b])
            self.assertEqual(len(indexed), 2)  # "bravo" is hashed but not grouped
            self.assertEqual(metrics["binary_files"], 4)
            self.assertEqual(metrics["binary_hash_candidates"], 3)
            self.assertEqual(metrics["binary_hash_skipped_unique_size"], 1)
            self.assertEqual(metrics["binary_hash_candidate_bytes"], 15)

    def test_identical_empty_files_are_still_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            a, b = root / "empty.svg", root / "empty.pdf"
            a.write_bytes(b"")
            b.write_bytes(b"")
            indexed, metrics = index_binary_files([a, b], workers=2)
            self.assertEqual(indexed[hashlib.sha256(b"").hexdigest()], [a, b])
            self.assertEqual(metrics["binary_hash_candidates"], 2)

    def test_single_file_does_not_start_workers(self):
        with tempfile.TemporaryDirectory() as tmp:
            a = Path(tmp) / "asset.png"
            a.write_bytes(b"one")
            indexed, metrics = index_binary_files([a], workers=4)
            self.assertEqual(indexed, {})
            self.assertEqual(metrics["binary_hash_workers"], 0)
            self.assertEqual(metrics["binary_hash_skipped_unique_size"], 1)


if __name__ == "__main__":
    unittest.main()
