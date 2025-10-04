import React, { useState, useRef, useEffect } from "react";
import {
  SignalIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/Layout/Footer";

interface TradeSignalData {
  summary: {
    totalRecords: number;
    signalRecords: number;
    signalPercentage: number;
  };
  signals: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
  strength: {
    buyAverage?: number;
    buyMax?: number;
    sellAverage?: number;
    sellMax?: number;
  };
  recentSignals: Array<{
    date: string;
    signal: string;
    strength: string;
    price: number;
  }>;
  latestData: {
    date: string;
    price: number;
    signal: string;
    strength: string;
    buySignals: number;
    sellSignals: number;
  } | null;
}

const TradeSignalsPage: React.FC = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<TradeSignalData | null>(
    null
  );
  const resultRef = useRef<HTMLPreElement | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysisData(null);

    try {
      const response = await fetch(
        `/api/test/trade-signals?symbol=${encodeURIComponent(symbol)}`
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setAnalysisData(result.data);
      } else {
        // 根據HTTP狀態碼處理不同錯誤
        let errorMessage = result.error || "分析失敗";

        if (response.status === 404) {
          // 資料不存在的情況
          errorMessage = `找不到股票代號 "${symbol}" 的資料\n\n${
            result.details || ""
          }\n\n建議：\n• 確認股票代號格式是否正確\n• 嘗試其他股票代號\n• 聯繫管理員確認資料庫狀態`;
        } else if (response.status === 400) {
          // 請求參數錯誤
          errorMessage = `請求參數錯誤：${errorMessage}`;
        } else if (response.status === 500) {
          // 伺服器內部錯誤
          errorMessage = `伺服器內部錯誤：${errorMessage}\n\n請稍後再試，或聯繫技術支援`;
        } else {
          // 其他錯誤
          if (
            errorMessage.includes("找不到") ||
            errorMessage.includes("沒有資料")
          ) {
            errorMessage = `找不到股票代號 "${symbol}" 的資料，請確認：\n• 股票代號是否正確\n• 該股票是否已上市\n• 資料庫是否包含此股票的歷史資料`;
          } else if (errorMessage.includes("無法解析")) {
            errorMessage = "分析結果解析失敗，可能是資料格式問題";
          } else if (errorMessage.includes("連線")) {
            errorMessage = "資料庫連線失敗，請稍後再試";
          }
        }

        setError(errorMessage);
      }
    } catch (err) {
      let errorMessage = "網路連線失敗";

      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          errorMessage = "無法連接到伺服器，請檢查網路連線";
        } else if (err.message.includes("timeout")) {
          errorMessage = "請求逾時，請稍後再試";
        } else {
          errorMessage = `網路錯誤：${err.message}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 自動捲動到最底
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [analysisData]);

  const getSignalColor = (signal: string) => {
    if (signal.includes("買入")) return "text-green-600 bg-green-50";
    if (signal.includes("賣出")) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getSignalIcon = (signal: string) => {
    if (signal.includes("買入")) return "📈";
    if (signal.includes("賣出")) return "📉";
    return "📊";
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <button
          type="button"
          className="mb-6 group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm"
          onClick={() => window.history.back()}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="relative z-10">返回上一頁</span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>

        <h1 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          進階交易訊號分析
        </h1>
        <p className="text-center text-gray-500 mb-6">只先做台股而已💤</p>

        <form
          className="flex flex-col sm:flex-row gap-2 mb-8 items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && symbol) handleAnalyze();
          }}
        >
          <input
            type="text"
            className="flex-1 border-2 border-indigo-200 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm transition-all duration-200 min-w-[180px]"
            placeholder="請輸入股票代號 (如 2330)"
            value={symbol}
            onChange={(e) =>
              setSymbol(e.target.value.replace(/[^0-9A-Za-z]/g, ""))
            }
            disabled={loading}
            maxLength={10}
            autoFocus
          />
          <button
            type="submit"
            className="w-32 px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg text-lg font-semibold disabled:opacity-60 text-center shadow-md transition-all duration-200"
            disabled={!symbol || loading}
          >
            {loading ? "分析中..." : "分析"}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-700 font-medium mb-2">
              {error.includes("找不到") ? "📋 查無資料" : "❌ 分析失敗"}
            </div>
            <div className="text-red-600 text-sm whitespace-pre-line">
              {error}
            </div>

            {error.includes("找不到") && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <div className="text-yellow-700 font-medium mb-1">
                  💡 常見股票代號範例
                </div>
                <div className="text-yellow-600 space-y-1">
                  <div>• 台積電：2330</div>
                  <div>• 聯發科：2454</div>
                  <div>• 鴻海：2317</div>
                  <div>• 台達電：2308</div>
                  <div>• 元大台灣50：0050</div>
                </div>
              </div>
            )}

            {error.includes("伺服器內部錯誤") && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <div className="text-blue-700 font-medium mb-1">🔧 故障排除</div>
                <div className="text-blue-600">
                  • 稍等幾分鐘後重新嘗試
                  <br />
                  • 如問題持續，請聯繫技術支援
                  <br />• 錯誤時間：{new Date().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-8 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-indigo-700 font-medium">
                正在分析交易訊號...
              </span>
            </div>
          </div>
        )}

        {analysisData && (
          <div className="space-y-6">
            {/* 總體統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-700 font-medium">總資料筆數</div>
                <div className="text-2xl font-bold text-blue-800">
                  {analysisData.summary.totalRecords.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  來自資料庫的股票K線資料總筆數
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-700 font-medium">有訊號筆數</div>
                <div className="text-2xl font-bold text-green-800">
                  {analysisData.summary.signalRecords.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  觸發買賣訊號的資料筆數
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-purple-700 font-medium">訊號覆蓋率</div>
                <div className="text-2xl font-bold text-purple-800">
                  {analysisData.summary.signalPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  有訊號筆數 ÷ 總資料筆數 × 100
                </div>
              </div>
            </div>

            {/* 最新資料狀態 */}
            {analysisData.latestData && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-800">
                  🔄 最新資料狀態
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">最新日期</div>
                    <div className="text-lg font-bold text-gray-800">
                      {analysisData.latestData.date}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">收盤價</div>
                    <div className="text-lg font-bold text-gray-800">
                      NT$ {analysisData.latestData.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">當前訊號</div>
                    <div
                      className={`text-lg font-bold ${
                        getSignalColor(analysisData.latestData.signal).split(
                          " "
                        )[0]
                      }`}
                    >
                      {analysisData.latestData.signal || "無訊號"}
                    </div>
                  </div>
                </div>
                {analysisData.latestData.signal && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">訊號強度</div>
                      <div className="text-base font-medium text-gray-700">
                        {analysisData.latestData.strength}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">多頭分數</div>
                      <div className="text-base font-bold text-green-600">
                        {analysisData.latestData.buySignals.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">空頭分數</div>
                      <div className="text-base font-bold text-red-600">
                        {analysisData.latestData.sellSignals.toFixed(1)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 交易訊號統計 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                📊 交易訊號統計
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(analysisData.signals).map(([signal, data]) => (
                  <div
                    key={signal}
                    className={`p-3 rounded-lg border ${getSignalColor(signal)}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getSignalIcon(signal)}</span>
                      <span className="font-medium text-sm">{signal}</span>
                    </div>
                    <div className="text-lg font-bold">{data.count}次</div>
                    <div className="text-xs opacity-75">
                      {data.percentage.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 訊號強度 */}
            {(analysisData.strength.buyAverage ||
              analysisData.strength.sellAverage) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  💪 訊號強度分析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisData.strength.buyAverage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-green-700 font-medium mb-2">
                        🟢 多頭訊號強度
                      </div>
                      <div className="space-y-1">
                        <div>
                          平均:{" "}
                          <span className="font-bold">
                            {analysisData.strength.buyAverage.toFixed(1)}分
                          </span>
                        </div>
                        <div>
                          最高:{" "}
                          <span className="font-bold">
                            {analysisData.strength.buyMax?.toFixed(1)}分
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {analysisData.strength.sellAverage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-700 font-medium mb-2">
                        🔴 空頭訊號強度
                      </div>
                      <div className="space-y-1">
                        <div>
                          平均:{" "}
                          <span className="font-bold">
                            {analysisData.strength.sellAverage.toFixed(1)}分
                          </span>
                        </div>
                        <div>
                          最高:{" "}
                          <span className="font-bold">
                            {analysisData.strength.sellMax?.toFixed(1)}分
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 最近訊號 */}
            {analysisData.recentSignals.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  ⏰ 最近交易訊號
                </h3>
                <div className="space-y-3">
                  {analysisData.recentSignals.map((signal, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getSignalColor(
                        signal.signal
                      )}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span>{getSignalIcon(signal.signal)}</span>
                          <div>
                            <div className="font-medium">{signal.signal}</div>
                            <div className="text-sm opacity-75">
                              {signal.strength}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{signal.date}</div>
                          {signal.price > 0 && (
                            <div className="text-sm opacity-75">
                              NT$ {signal.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !analysisData && !error && (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
                <SignalIcon className="w-12 h-12 text-indigo-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-700">開始交易訊號分析</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                輸入股票代號，獲得專業的技術分析與交易建議
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mt-6">
                <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>買入訊號</span>
                </div>
                <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          <span>賣出訊號</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TradeSignalsPage;
