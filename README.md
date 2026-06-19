# もと情報アカデミー LP

画像なし・点線枠なしの、GitHub Pages向け静的サイトです。
問い合わせフォームは、画面遷移なしのカスタムUIで Googleフォームに送信します。

## ファイル構成

```text
information-juku/
├── index.html        # LP本体。文章・セクション構造
├── styles.css        # 色・レイアウト・レスポンシブ・アニメーション
├── script.js         # メニュー / FAQ / Googleフォーム送信 / バリデーション
├── tokushoho.html    # 特定商取引法に基づく表記
├── privacy.html      # プライバシーポリシー
├── sitemap.xml       # SEO用サイトマップ
├── robots.txt        # クローラー向け設定
├── site.webmanifest  # favicon / PWA系メタ情報
├── assets/           # favicon・OGP画像
└── README.md
```

## 現在の主な訴求

- 高校「情報」を土台に、ITをまるっと学ぶ
- 情報Ⅰ対応
- 情報Ⅱ対応
- テック甲子園（アプリ甲子園）の制作サポート可能
- 大学入学共通テストなどの受験対策は、今後専用講座として整備予定
- 小学生・社会人・シニアも歓迎
- 集団オンライン：月1万円（月4回）
- 個別オンライン：月2万円（月4回）

## よく触る場所

- 文章変更：`index.html`
- 色・余白変更：`styles.css` の `:root`
- 問い合わせフォーム変更：`index.html` の `CONTACT` セクションと `script.js` の `GOOGLE_FORM_CONFIG`
- 法務ページ変更：`tokushoho.html` / `privacy.html`

## Googleフォーム設定

`script.js` にフォーム送信先URLと entry ID を設定済みです。

```js
const GOOGLE_FORM_CONFIG = {
  url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScdMHnjCAXTQv4wlUVTZ-H1C68lm_0mp8mdisE4QRyD7cPrBw/formResponse',
  entryIds: {
    name: 'entry.1222301912',
    email: 'entry.322927418',
    message: 'entry.289483082',
    course: 'entry.1602744192',
  },
  sentinelIds: {
    course: 'entry.1602744192_sentinel',
  },
};
```

## SEO / GitHub Pages

- `index.html` に title / description / OGP / Twitter Card / JSON-LD を設定済み
- `robots.txt` と `sitemap.xml` を配置済み
- CSS / JS は `./styles.css` のような相対パスで読み込み
- `.nojekyll` を配置済み
- リポジトリ直下を公開元にするとそのまま動きます


