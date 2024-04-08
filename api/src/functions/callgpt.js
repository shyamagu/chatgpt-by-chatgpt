const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { app } = require('@azure/functions');

// 定数
const SYSTEM_PROMPT = "You are a capable assistant.";

app.http('callgpt', {
    methods: ['POST'], // 仕様に基づきPOSTリクエストのみを処理すると仮定
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            context.log(`Http function processed request for url "${request.url}"`);

            // リクエストボディからJSONオブジェクトを抽出
            const { endpoint, model, apiKey, messages } = await request.json();

            // システムプロンプトをメッセージ配列の先頭に追加
            const modifiedMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

            // OpenAIクライアントを初期化
            const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

            // 応答を取得
            const events = await client.streamChatCompletions(model, modifiedMessages);
            let answer = '';

            for await (const event of events) {
                for (const choice of event.choices) {
                    const delta = choice.delta?.content;
                    if (delta !== undefined) {
                        answer += delta;
                    }
                }
            }

            // 応答を返す
            return { body: JSON.stringify({ "message": answer }), headers: { 'Content-Type': 'application/json' } };
        } catch (error) {
            context.log.error(`An error occurred in the application: ${error.message}`);
            return { status: 501, body: `An error occurred in the application: ${error.message}` };
        }
    }
});

module.exports = app;
