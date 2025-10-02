import React, { useState } from 'react';
import Head from 'next/head';

const LINE_ID = '@157fqxej'; // <-- 把這裡替換成你的 LINE 官方帳號（包含 @）

export default function LineAddPage() {
	const [copied, setCopied] = useState(false);

	const webUrl = `https://line.me/R/ti/p/${encodeURIComponent(LINE_ID)}`;
	const nativeUrl = `line://ti/p/${encodeURIComponent(LINE_ID)}`;
	const qrSrc = `https://qr-official.line.me/gs/M_157fqxej_GW.png`;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(LINE_ID);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			// 若 clipboard API 不可用可提示使用者手動複製
			alert('複製失敗，請手動複製 LINE 帳號');
		}
	};

	return (
		<>
			<Head>
				<title>加入 LINE 好友</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main style={{ fontFamily: 'Arial, sans-serif', padding: 24, maxWidth: 720, margin: '0 auto' }}>
				<h1 style={{ marginBottom: 8 }}>加入我們的 LINE 好友</h1>
				<p style={{ color: '#555' }}>
					使用下列連結或掃描 QR Code 加入官方 LINE 帳號，加入後可收到最新消息與服務通知。
				</p>

				<section style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 20 }}>
					<div style={{ flex: '1 1 300px' }}>
						<img
							src={qrSrc}
							alt="LINE 加入好友 QR Code"
							style={{ width: 250, height: 250, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
						/>
					</div>

					<div style={{ flex: '1 1 300px' }}>
						<div style={{ marginBottom: 12 }}>
							<strong>LINE 帳號：</strong>
							<span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{LINE_ID}</span>
						</div>

						<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
							<a
								href={webUrl}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									background: '#00c300',
									color: '#fff',
									padding: '10px 16px',
									borderRadius: 6,
									textDecoration: 'none',
									fontWeight: 600,
								}}
								aria-label="用 Web 開啟加入 LINE 好友"
							>
								以網頁加入
							</a>

							<a
								href={nativeUrl}
								style={{
									background: '#00a700',
									color: '#fff',
									padding: '10px 16px',
									borderRadius: 6,
									textDecoration: 'none',
									fontWeight: 600,
								}}
								aria-label="以 LINE 應用程式加入好友"
							>
								用 LINE App 開啟
							</a>

							<button
								onClick={copyToClipboard}
								style={{
									background: '#f3f3f3',
									border: '1px solid #ddd',
									padding: '10px 14px',
									borderRadius: 6,
									cursor: 'pointer',
								}}
								aria-label="複製 LINE 帳號"
							>
								複製帳號
							</button>
						</div>

						{copied && (
							<div
								role="status"
								aria-live="polite"
								style={{
									marginTop: 12,
									background: '#e6ffed',
									color: '#006400',
									padding: '8px 12px',
									borderRadius: 6,
									display: 'inline-block',
								}}
							>
								已複製到剪貼簿
							</div>
						)}

						<div style={{ marginTop: 14, color: '#666', fontSize: 14 }}>
							提示：若使用桌面瀏覽器無法直接開啟 LINE App，請掃描上方 QR Code 或複製帳號後在手機上搜尋加入。
						</div>
					</div>
				</section>
			</main>
		</>
	);
}