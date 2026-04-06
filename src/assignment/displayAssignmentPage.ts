import * as vscode from 'vscode';
import { Assignment } from './assignment';

export async function displayAssignmentPage(assignment: Assignment) {
    const panel = vscode.window.createWebviewPanel(
        'assignmentPage',
        `Assignment: ${assignment.label}`,
        vscode.ViewColumn.Two
    );
    
    panel.webview.html = getWebviewContent(assignment);
}

function getWebviewContent(assignment: Assignment): string {
    const dueText = assignment.dueAt ? assignment.dueAt : '미정';
    const pointsText = assignment.pointsPossible ? `${assignment.pointsPossible}점` : '미지정';
    const submitTypeText = assignment.submissionTypes?.length
        ? assignment.submissionTypes.join(' · ')
        : '제출 방식 없음';

    return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${assignment.label}</title>
            <style>
                :root {
                    --bg-top: #f7efe2;
                    --bg-bottom: #d9e8f3;
                    --ink: #24323d;
                    --ink-soft: #4a5964;
                    --surface: rgba(255, 255, 255, 0.86);
                    --surface-border: rgba(36, 50, 61, 0.14);
                    --brand: #0f6d8a;
                    --brand-strong: #09546b;
                    --chip: #ebf5fa;
                    --chip-border: #c4dfea;
                    --shadow: 0 18px 46px rgba(24, 43, 54, 0.17);
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    min-height: 100vh;
                    padding: 28px 20px;
                    color: var(--ink);
                    font-family: "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
                    background:
                        radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.78), transparent 42%),
                        radial-gradient(circle at 88% 6%, rgba(226, 239, 247, 0.82), transparent 33%),
                        linear-gradient(155deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
                }

                .shell {
                    max-width: 980px;
                    margin: 0 auto;
                    display: grid;
                    gap: 18px;
                }

                .hero {
                    padding: 24px;
                    border-radius: 18px;
                    border: 1px solid var(--surface-border);
                    background: var(--surface);
                    box-shadow: var(--shadow);
                    animation: riseIn 0.55s ease-out both;
                }

                .hero h1 {
                    margin: 0;
                    font-size: clamp(1.45rem, 2.5vw, 2.15rem);
                    line-height: 1.3;
                    letter-spacing: -0.02em;
                }

                .meta {
                    margin-top: 14px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .meta span {
                    display: inline-flex;
                    align-items: center;
                    padding: 7px 11px;
                    border-radius: 999px;
                    background: var(--chip);
                    border: 1px solid var(--chip-border);
                    color: var(--ink-soft);
                    font-size: 0.86rem;
                    font-weight: 600;
                }

                .content-card {
                    border-radius: 18px;
                    border: 1px solid var(--surface-border);
                    background: rgba(255, 255, 255, 0.93);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                    animation: riseIn 0.65s ease-out 0.08s both;
                }

                .content-header {
                    padding: 14px 20px;
                    border-bottom: 1px solid rgba(36, 50, 61, 0.1);
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--ink-soft);
                    background: linear-gradient(180deg, rgba(246, 251, 253, 0.96), rgba(241, 247, 250, 0.96));
                }

                .description {
                    padding: 22px 20px;
                    white-space: normal;
                    color: var(--ink);
                    line-height: 1.65;
                    word-break: break-word;
                }

                .submit-card {
                    padding: 18px 20px;
                    border-radius: 18px;
                    border: 1px solid var(--surface-border);
                    background: var(--surface);
                    box-shadow: var(--shadow);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    animation: riseIn 0.75s ease-out 0.16s both;
                }

                .submit-card p {
                    margin: 0;
                    color: var(--ink-soft);
                    font-size: 0.94rem;
                }

                .submit-btn {
                    border: 0;
                    border-radius: 12px;
                    padding: 12px 20px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                    cursor: pointer;
                    color: #ffffff;
                    background: linear-gradient(135deg, var(--brand), var(--brand-strong));
                    box-shadow: 0 10px 20px rgba(15, 109, 138, 0.33);
                    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
                }

                .submit-btn:hover {
                    transform: translateY(-1px);
                    filter: brightness(1.03);
                    box-shadow: 0 14px 26px rgba(15, 109, 138, 0.4);
                }

                .submit-btn:active {
                    transform: translateY(0);
                }

                @keyframes riseIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 720px) {
                    body {
                        padding: 16px 12px 20px;
                    }

                    .hero,
                    .content-card,
                    .submit-card {
                        border-radius: 14px;
                    }

                    .submit-card {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .submit-btn {
                        width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="shell">
                <section class="hero">
                    <h1>${assignment.label}</h1>
                    <div class="meta">
                        <span>마감: ${dueText}</span>
                        <span>배점: ${pointsText}</span>
                        <span>방식: ${submitTypeText}</span>
                    </div>
                </section>

                <section class="content-card">
                    <div class="content-header">과제 안내</div>
                    <div class="description">
                        ${assignment.html}
                    </div>
                </section>

                <form class="submit-card" action="/submit" method="post">
                    <input type="hidden" name="assignmentId" value="${assignment.id_}">
                    <p>제출 전 과제 요건과 첨부 파일을 다시 확인하세요.</p>
                    <button class="submit-btn" type="submit">과제 제출하기</button>
                </form>
            </div>
        </body>
        </html>
    `;
}