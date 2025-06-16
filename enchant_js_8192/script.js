enchant();

window.onload = function () {
	const game = new Game(400, 500);  	//画面サイズを400*500にする。

	//クリック音
	const clickSndUrl = "click.wav";	//game.htmlからの相対パス
	game.preload([clickSndUrl]); 		//データを読み込んでおく

	//リトライボタン画像
	const retryImgUrl = "img/retry.png";
	game.preload([retryImgUrl]);

	//ツイートボタン画像
	const tweetImgUrl = "img/tweet.png";
	game.preload([tweetImgUrl]);	

	//青色ゲート画像
	const blueGateImg = "img/blue.png";
	game.preload([blueGateImg]);	

	//緑色ゲート画像
	const greenGateImg = "img/green.png";
	game.preload([greenGateImg]);	


	game.onload = function () {	//ロード後にこの関数が呼び出される

		let state = 0;		//1/2判定結果
		let tryCount = 1;	//試行回数
		let nowBunbo = 1; 	//現在の確率分母
		let maxBunbo = 1;	//最高到達分母

		const mainScene = new Scene();					//メインのシーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "black"; 			//シーンの背景色

		//試行回数表示テキスト
		const scoreText = new Label();					//テキストはLabelクラス
		scoreText.font = "20px Meiryo";					//フォント設定
		scoreText.color = 'rgba(255,255,255,1)';	   //色　RGB+透明度
		scoreText.width = 400;							//横幅
		scoreText.moveTo(10, 30);						//表示位置
		mainScene.addChild(scoreText);					//mainSceneシーンにこのテキストを埋め込む

		//確率表示テキスト
		const kakuritsuText = new Label();	
		kakuritsuText.font = "20px Meiryo";	
		kakuritsuText.color = 'rgba(255,255,255,1)';
		kakuritsuText.width = 400;	
		kakuritsuText.moveTo(180, 330);
		mainScene.addChild(kakuritsuText);	

		//履歴表示テキスト
		const rirekiText = new Label();	
		rirekiText.font = "20px Meiryo";	
		rirekiText.color = 'rgba(255,255,255,1)';
		rirekiText.width = 400;	
		rirekiText.moveTo(0, 370);
		mainScene.addChild(rirekiText);	

		//最大到達分母表示テキスト
		const maxBunboText = new Label();	
		maxBunboText.font = "20px Meiryo";	
		maxBunboText.color = 'rgba(255,255,255,1)';
		maxBunboText.width = 400;	
		maxBunboText.moveTo(260, 30);
		mainScene.addChild(maxBunboText);	

		//青ゲートボタン
		const blueGateButton = new Sprite(117, 166);		//ボタンサイズ
		blueGateButton.moveTo(60, 150);						//ボタンの位置
		blueGateButton.image = game.assets[blueGateImg];	//ボタンに表示する画像
		mainScene.addChild(blueGateButton);					//mainSceneに画像を貼り付ける  
		
		//緑ゲートボタン
		const greenGateButton = new Sprite(117, 166);
		greenGateButton.moveTo(220, 150);
		greenGateButton.image = game.assets[greenGateImg];
		mainScene.addChild(greenGateButton);

		//青ゲートボタンをクリックした際の処理
		blueGateButton.ontouchend = function () {								
			game.assets[clickSndUrl].clone().play();	//音を鳴らす

			//ランダム値抽選（0~10の整数）
			var rand =  Math.floor(Math.random()*11);
			if (rand % 2 == 1) {	
				state = 1;				//奇数だったら1/2成功とする
				nowBunbo = nowBunbo*2;	//表示用分母を2倍する
				rirekiText.text = rirekiText.text+"青";
			} else {
				state = 2;	//失敗
				if(maxBunbo < nowBunbo){
					maxBunbo = nowBunbo;
				}
				maxBunboText.text = "最高到達 1/" + maxBunbo;
				rirekiText.text = rirekiText.text+"緑";
			}
		};

		//緑ゲートボタンをクリックした際の処理
		greenGateButton.ontouchend = function () {								
			game.assets[clickSndUrl].clone().play();
			//this.x = -200;								//

			//ランダム値抽選（0~10の整数）
			var rand =  Math.floor(Math.random()*11);
			if (rand % 2 == 1) {
				state = 1;				//奇数だったら1/2成功とする
				nowBunbo = nowBunbo*2;	//表示用分母を2倍する
				rirekiText.text = rirekiText.text+"緑";
			} else {
				state = 2;	//失敗
				if(maxBunbo < nowBunbo){
					maxBunbo = nowBunbo;
				}
				maxBunboText.text = "最高到達 1/" + maxBunbo;
				rirekiText.text = rirekiText.text+"緑";
			}
		};

		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "black";

		//GAMEOVERテキスト
		const gameOverText = new Label(); 
		gameOverText.font = "20px Meiryo";	
		gameOverText.color = 'rgba(255,255,255,1)';
		gameOverText.width = 400;	
		gameOverText.moveTo(140, 150);	
		endScene.addChild(gameOverText);

		//確率テキスト
		const gameOverKakuritsuText = new Label(); 
		gameOverKakuritsuText.font = "20px Meiryo";	
		gameOverKakuritsuText.color = 'rgba(255,255,255,1)';
		gameOverKakuritsuText.width = 400;	
		gameOverKakuritsuText.moveTo(180, 200);	
		endScene.addChild(gameOverKakuritsuText);

		//リトライボタン
		const retryBtn = new Sprite(120, 60);
		retryBtn.moveTo(50, 300);
		retryBtn.image = game.assets[retryImgUrl];
		endScene.addChild(retryBtn);

		//リトライボタン処理
		retryBtn.ontouchend = function () {		
			state = 0;
			nowBunbo = 1;
			tryCount++;
			game.popScene();					//endSceneシーンを外す
			game.pushScene(mainScene);			//mainSceneシーンを入れる
		};

		//ツイートボタン
		const tweetBtn = new Sprite(120, 60);
		tweetBtn.moveTo(230, 300);
		tweetBtn.image = game.assets[tweetImgUrl];
		endScene.addChild(tweetBtn);

		//ツイートボタン処理
		tweetBtn.ontouchend = function () {	
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			const url = encodeURI("https://hothukurou.com");
			window.open("http://twitter.com/intent/tweet?text=1/" + maxBunbo + "まで進んだ" + url); 
		};


		//メインループ
		game.onenterframe = function () {

			//数値系表示の更新
			kakuritsuText.text = "1/" + nowBunbo;
			scoreText.text = "試行" + tryCount +"回目";


			//ゲームオーバー判定
			if (state == 2) {		//1/2失敗
				game.popScene();			//mainSceneシーンを外す
				game.pushScene(endScene);	//endSceneシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				var LF = String.fromCharCode(10);
				gameOverText.text = "GAMEOVER";
				gameOverKakuritsuText.text = "1/"+nowBunbo;
			}

		};
	};

	game.start();
};