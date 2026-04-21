import { useState } from "react";
import {
  FiUploadCloud,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiLoader,
} from "react-icons/fi";

export default function DataIngestion({ isDark = true }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Waiting for file upload...");

  const startPipeline = (uploadedFiles) => {
    setProgress(0);
    setStatus("Initializing ingestion engine...");

    let value = 0;

    const timer = setInterval(() => {
      value += 7;
      setProgress(value);

      if (value < 20) setStatus("Reading file metadata...");
      else if (value < 45) setStatus("Validating schema...");
      else if (value < 70) setStatus("Transforming records...");
      else if (value < 95) setStatus("Writing to warehouse...");
      else setStatus("Finalizing pipeline...");

      if (value >= 100) {
        clearInterval(timer);

        const updated = uploadedFiles.map((file) => ({
          ...file,
          status:
            Math.random() > 0.12 ? "Success" : "Failed",
        }));

        setFiles(updated);

        const hasFailed = updated.some(
          (x) => x.status === "Failed"
        );

        setStatus(
          hasFailed
            ? "Completed with partial failures"
            : "Ingestion completed successfully"
        );
      }
    }, 320);
  };

  const onFiles = (list) => {
    const arr = Array.from(list || []).map((f, i) => ({
      id: i + Date.now(),
      name: f.name,
      size:
        (f.size / 1024 / 1024).toFixed(2) + " MB",
      status: "Pending",
    }));

    setFiles(arr);
    startPipeline(arr);
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Data Ingestion
            </h1>
            <p
              className={`mt-2 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Securely upload, validate and ingest data
              into enterprise systems
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
            ● System Healthy
          </div>
        </div>

        {/* Upload + Progress */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFiles(e.dataTransfer.files);
            }}
            className={`rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 backdrop-blur-xl ${
              dragging
                ? "border-cyan-400 scale-[1.02] shadow-2xl shadow-cyan-500/20"
                : isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-300 bg-white"
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-xl mb-5">
              <FiUploadCloud />
            </div>

            <h3 className="text-2xl font-bold">
              Upload Source Files
            </h3>

            <p
              className={`mt-2 text-sm ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              CSV, Excel, JSON, XML • Max 2GB
            </p>

            <label className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold cursor-pointer hover:scale-105 transition-all shadow-lg">
              Select Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) =>
                  onFiles(e.target.files)
                }
              />
            </label>
          </div>

          {/* Progress */}
          <div
            className={`rounded-3xl border p-7 backdrop-blur-xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-5">
              Pipeline Status
            </h3>

            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">
                Current Progress
              </span>
              <span className="font-bold text-cyan-400">
                {progress}%
              </span>
            </div>

            <div
              className={`h-4 rounded-full overflow-hidden ${
                isDark
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              {progress > 0 &&
                progress < 100 && (
                  <FiLoader className="animate-spin text-cyan-400" />
                )}

              <span
                className={
                  isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }
              >
                {status}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {[
                "Schema Validation",
                "Transformation",
                "Warehouse Load",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>{item}</span>
                  <span className="text-emerald-400">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Files */}
        <div
          className={`rounded-3xl border p-7 backdrop-blur-xl ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <h3 className="text-xl font-bold mb-5">
            Uploaded Files
          </h3>

          <div className="space-y-3">
            {files.length === 0 && (
              <p className="text-sm text-slate-400">
                No files uploaded yet.
              </p>
            )}

            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition ${
                  isDark
                    ? "bg-slate-900/70 hover:bg-slate-900"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <FiFileText />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {file.size}
                    </p>
                  </div>
                </div>

                {file.status === "Success" && (
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <FiCheckCircle />
                    Success
                  </span>
                )}

                {file.status === "Failed" && (
                  <span className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                    <FiXCircle />
                    Failed
                  </span>
                )}

                {file.status === "Pending" && (
                  <span className="text-yellow-400 text-sm">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}