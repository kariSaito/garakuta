enchant();

window.onload = function () {
	const game = new Game(400, 500);  	//画面サイズ

	//クリック音
	const clickSndUrl = "sound/click.wav";	//game.htmlからの相対パス
	game.preload([clickSndUrl]); 			//データを読み込む

	//失敗音
	const missSnd = "sound/puchun.wav";	
	game.preload([missSnd]);

	//リトライボタン画像
	const retryImgUrl = "img/retry.png";
	game.preload([retryImgUrl]);

	//ツイートボタン画像
	const tweetImgUrl = "img/tweet.png";
	game.preload([tweetImgUrl]);	

	//ゲームオーバー画像
	const gameoverImg = "img/gameover.png";
	game.preload([gameoverImg]);	

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
		let rireki = "";	//正解履歴の文字列


		////メインシーン////
		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "black"; 			//シーンの背景色

		//試行回数表示テキスト
		const countText = new Label();					//テキストはLabelクラス
		countText.font = "20px Meiryo";					//フォント設定
		countText.color = 'rgba(255,255,255,1)';	   //色（RGB+透明度）
		countText.width = 400;							//横幅
		countText.moveTo(10, 30);						//表示位置
		mainScene.addChild(countText);					//シーンにこのテキストを追加

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
		rirekiText.width = 347;	
		rirekiText.moveTo(20, 370);
		mainScene.addChild(rirekiText);	

		//最大到達分母テキスト
		const maxBunboText = new Label();	
		maxBunboText.font = "20px Meiryo";	
		maxBunboText.color = 'rgba(255,255,255,1)';
		maxBunboText.width = 400;	
		maxBunboText.moveTo(315, 55);
		mainScene.addChild(maxBunboText);	

		//最大到達点テキスト
		const toutatsuText = new Label();	
		toutatsuText.font = "20px Meiryo";	
		toutatsuText.color = 'rgba(255,255,255,1)';
		toutatsuText.width = 400;	
		toutatsuText.moveTo(290, 30);
		mainScene.addChild(toutatsuText);
		toutatsuText.text = "最高到達点"

		//青ゲートボタン
		const blueGateButton = new Sprite(117, 166);		//ボタンサイズ
		blueGateButton.moveTo(60, 150);						//ボタンの位置
		blueGateButton.image = game.assets[blueGateImg];	//ボタンに表示する画像
		mainScene.addChild(blueGateButton);					//シーンにボタンを追加  
		
		//緑ゲートボタン
		const greenGateButton = new Sprite(117, 166);
		greenGateButton.moveTo(220, 150);
		greenGateButton.image = game.assets[greenGateImg];
		mainScene.addChild(greenGateButton);

		//青ゲートボタンをクリックした際の処理
		blueGateButton.ontouchend = function () {								
			game.assets[clickSndUrl].clone().play();	//音を鳴らす
			var rand =  Math.floor(Math.random()*11);	//ランダム値抽選（0~10の整数）

			if (rand % 2 == 1) {	
				state = 1;					//奇数だったら1/2成功とする
				nowBunbo = nowBunbo*2;		//表示用分母を2倍する
				rireki = "青" + rireki;		//正解履歴文字列を先頭に追加
				rirekiText.text = rireki;
			} else {
				state = 2;	//失敗
				if(maxBunbo < nowBunbo){	//以前の最高分母より進んでいたら更新
					maxBunbo = nowBunbo;
				}
				maxBunboText.text = "1/" + maxBunbo;
				rireki = "緑" + rireki;
				rirekiText.text = rireki;
				game.assets[missSnd].clone().play();	//ゲームオーバー音
			}
		};

		//緑ゲートボタンをクリックした際の処理（履歴の記載文字以外は青と同じ）
		greenGateButton.ontouchend = function () {								
			game.assets[clickSndUrl].clone().play();
			var rand =  Math.floor(Math.random()*11);

			if (rand % 2 == 1) {
				state = 1;
				nowBunbo = nowBunbo*2;
				rireki = "緑" + rireki;
				rirekiText.text = rireki;
			} else {
				state = 2;
				if(maxBunbo < nowBunbo){
					maxBunbo = nowBunbo;
				}
				maxBunboText.text = "1/" + maxBunbo;
				rireki = "青" + rireki;
				rirekiText.text = rireki;
				game.assets[missSnd].clone().play();
			}
		};


		////ゲームオーバー画面////
		const endScene = new Scene();
		endScene.backgroundColor = "black";

		//GAMEOVER画像 ※画像だけの貼り付けがわからんかったからボタンに張り付け
		const gameOverBtn = new Sprite(210, 31);
		gameOverBtn.moveTo(90, 150);
		gameOverBtn.image = game.assets[gameoverImg];
		endScene.addChild(gameOverBtn);

		//確率テキスト
		const kakuritsuTextEnd = new Label(); 
		kakuritsuTextEnd.font = "20px Meiryo";	
		kakuritsuTextEnd.color = 'rgba(255,255,255,1)';
		kakuritsuTextEnd.width = 400;	
		kakuritsuTextEnd.moveTo(180, 200);	
		endScene.addChild(kakuritsuTextEnd);

		//最大到達分母テキスト
		const maxBunboTextEnd = new Label();	
		maxBunboTextEnd.font = "20px Meiryo";	
		maxBunboTextEnd.color = 'rgba(255,255,255,1)';
		maxBunboTextEnd.width = 400;	
		maxBunboTextEnd.moveTo(315, 55);
		endScene.addChild(maxBunboTextEnd);	

		//最大到達点テキスト
		const toutatsuTextEnd = new Label();	
		toutatsuTextEnd.font = "20px Meiryo";	
		toutatsuTextEnd.color = 'rgba(255,255,255,1)';
		toutatsuTextEnd.width = 400;	
		toutatsuTextEnd.moveTo(290, 30);
		endScene.addChild(toutatsuTextEnd);

		//試行回数表示テキスト
		const countTextEnd = new Label();
		countTextEnd.font = "20px Meiryo";
		countTextEnd.color = 'rgba(255,255,255,1)';
		countTextEnd.width = 400;
		countTextEnd.moveTo(10, 30);
		endScene.addChild(countTextEnd);

		//履歴表示テキスト
		const rirekiTextEnd = new Label();	
		rirekiTextEnd.font = "20px Meiryo";	
		rirekiTextEnd.color = 'rgba(255,255,255,1)';
		rirekiTextEnd.width = 347;	
		rirekiTextEnd.moveTo(20, 370);
		endScene.addChild(rirekiTextEnd);

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
			const url = encodeURI("https://karisaito.github.io/garakuta/enchant_js_8192/");
			window.open("http://twitter.com/intent/tweet?text=" +
				"最高1/" + maxBunbo + "まで進んだ！" + url); 
		};


		////メインループ////
		game.onenterframe = function () {
			//数値系表示の更新
			kakuritsuText.text = "1/" + nowBunbo;
			countText.text = "試行" + tryCount +"回目";

			//ゲームオーバー判定
			if (state == 2) {		//1/2失敗
				game.popScene();			//mainSceneシーンを外す
				game.pushScene(endScene);	//endSceneシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				kakuritsuTextEnd.text = "1/"+nowBunbo;
				toutatsuTextEnd.text = "最高到達点"
				maxBunboTextEnd.text = "1/" + maxBunbo;
				rirekiTextEnd.text = rireki;
				countTextEnd.text = "試行" + tryCount +"回目";
			}

		};
		
	};

	game.start();
};