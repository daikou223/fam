const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const { NodeSSH } = require('node-ssh');
const cors = require('cors');
const path = require('path');  

app.use(cors());  // CORSを許可する
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

async function API(query,params = []) {
    const ssh = new NodeSSH();
    console.log("APIへようこそ");

    // SSHサーバーに接続
    await ssh.connect({
        host: 'daikou223.sakura.ne.jp',
        port: 22,
        username: 'daikou223',
        password: 'Kh436528',
    });

    // SSHトンネルを作成（ローカルポートをリモートのMySQLサーバに転送）
    const forward = await ssh.forwardOut(
        '127.0.0.1', // ローカルアドレス
        0,           // 任意のローカルポート
        'mysql3102.db.sakura.ne.jp', // リモートMySQLホスト
        3306          // リモートMySQLポート
    );

    console.log('SSHトンネルが作成されました');

    // MySQL接続を確立
    const con = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3307,  // ローカルで転送されたポート
        user: 'daikou223',
        password: 'Kh436528',
        database: 'daikou223_for_family',
        stream: forward, // SSH転送されたストリームを使用
    });

    console.log('MySQL接続成功');

    // クエリを実行
    const [rows] = await con.execute(query,params);
    console.log('クエリ結果:', rows);

    // 接続を閉じる
    await con.end();
    ssh.dispose();
    console.log('接続を閉じました');

    return rows;
}


app.get('/api/users', async (req, res) => {
    try {
        const rows = await API('SELECT * FROM `user`');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

app.post('/api/users', async (req, res) => {
    const userData = req.body; // クライアントから送信されたデータ
    console.log('受信したデータ:', userData);

    const { id, state } = userData;

    try {
        // プレースホルダを使った安全なクエリ
        const query = "UPDATE `user` SET state = ? WHERE id = ?";
        const values = [state, id];

        // API関数の呼び出し (非同期)
        const result = await API(query, values);

        console.log('更新結果:', result);

        // クライアントにレスポンスを返す
        res.status(200).json({ success: true, message: 'データが更新されました', data: userData });
    } catch (error) {
        console.error('更新エラー:', error);
        res.status(500).json({ success: false, error: 'データ更新中にエラーが発生しました' });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`ポート ${port} でリスニング中...`));
app.use(express.json());