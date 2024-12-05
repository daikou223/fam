//import API from './path/to/API';
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const {NodeSSH}  = require('node-ssh');


async function API(query) {
    const ssh = new NodeSSH();
    console.log("welcome API")
    
    // 接続
    await ssh.connect({
        host: 'daikou223.sakura.ne.jp',
        port: 22,
        username: 'daikou223',
        password: 'Kh436528'
    });

    // コマンド実行
   let res = await ssh.execCommand('ls -al', {options: {pty: true}});
    console.log(res.stdout)

    const forward = await ssh.forwardOut(
        '127.0.0.1', // ローカルアドレス
        0,           // 任意のローカルポートを使用
        'mysql3102.db.sakura.ne.jp', // リモートMySQLホスト
        3306          // リモートMySQLポート
    );

    console.log('トンネル作成成功');


    const con = await mysql.createConnection({
        database: 'daikou223_for_family',
        host: '127.0.0.1',
        user: 'daikou223',
        password: 'Kh436528',
        stream: forward,
        port:3307,
      });
      
      console.log('MySQL接続成功');

      // クエリ実行
      const [rows] = await con.execute(query);
      console.log('クエリ結果:', rows);

      // 接続終了
      await con.end();
      ssh.dispose();
      console.log('接続を閉じました');

      return rows;
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.use(express.json());



app.get('/api/handler', async (req, res) => {
    try {
      const [rows] = await API('SELECT * FROM `user`');
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  });