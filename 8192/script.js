enchant();

window.onload = function () {
	
	//画面サイズ
	const game = new Game(400, 500);  	

	//ファイルパスの定義
	const clickSndUrl = "sound/click.wav";	//クリック音
	const titleImg = "img/8192.png";		//タイトル画像
	const startImg = "img/start.png";		//開始ボタン画像
	const retryImg = "img/retry.png";		//リトライボタン画像
	const tweetImg = "img/tweet.png";		//ツイートボタン画像
	const gameoverImg = "img/gameover.png";	//ゲームオーバー画像
	const blueGateImg = "img/blue.png";		//青色ゲート画像
	const greenGateImg = "img/green.png";	//緑色ゲート画像
	const seisekiImg = "img/seiseki.png";	//成績表示ボタン画像
	const modoruImg = "img/modoru.png";		//戻るボタン画像
	const clearImg = "img/clear.png";		//クリア画像
	const kakuninImg = "img/kakunin.png";	//再確認ボタン画像
	const end8192Img = "img/end8192.png";	//クリア画面の8192表示画像
	const thanksClearImg = "img/thanksClear.png"	//クリア画面のメッセージ画像

	//ファイルをロードする
	game.preload([clickSndUrl]); 
	game.preload([titleImg]);
	game.preload([startImg]);
	game.preload([startImg]);
	game.preload([retryImg]);
	game.preload([tweetImg]);
	game.preload([gameoverImg]);	
	game.preload([blueGateImg]);
	game.preload([greenGateImg]);	
	game.preload([seisekiImg]);	
	game.preload([modoruImg]);	
	game.preload([clearImg]);
	game.preload([kakuninImg]);	
	game.preload([end8192Img]);	
	game.preload([thanksClearImg]);	


	game.onload = function () {	//ロード後にこの関数が呼び出される
		let tryCount = 0;				//試行回数
		let nowBunbo = 1; 				//現在の確率分母
		let maxBunbo = 1;				//最高到達分母
		let rireki = "";				//正解色履歴の文字列
		let jotai = "main";				//現在の表示状態
		let gatefadeOutSpeedMoto = 0.8; //ゲート用フェードアウトスピード初期値
		let gatefadeOutSpeed = gatefadeOutSpeedMoto;	//確率が重くなるにつれて徐々に遅くなる

		let fontStyle = "20px Meiryo";			 //フォント
		let fontColor = 'rgba(255,255,255,1)';	//フォント色（RGB+透明度）

		let blueGateFadeOut = 0;	//フェードアウト用フラグ
		let greenGateFadeOut = 0;
		let startBtnFadeOut = 0;
		let clearFadeOut = 0;
		let retryBtnFadeOut = 0;

		let eight192FadeIn = 0;	//フェードイン用フラグ
		let omedetoFadeIn1 = 0;
		let omedetoFadeIn2 = 0;


		//メインループ 各フラグを待機 ※1フレームごとに呼び出される/////////////////////////////////////
		game.onenterframe = function(){

			var fadeOutSpeed = 0.2;
			if(startBtnFadeOut == 1){				//ボタンによってフラグが立ったら
				startBtn.opacity -= fadeOutSpeed/4;	//不透明度を減らす
				titleBtn.opacity -= fadeOutSpeed/4;
				if(startBtn.opacity <= 0 ){			//完全に消えたら元に戻す+その後の動作を実行
					startBtn.opacity = 1;
					titleBtn.opacity = 1;
					startBtnFadeOut = 0;
					shokika();
					//nowBunbo = 4096;	//デバッグ用
				}
			}
			if(blueGateFadeOut == 1){					
				blueGateButton.opacity -= gatefadeOutSpeed;
				if(blueGateButton.opacity < 0 ){
					blueGateButton.opacity = 1;
					blueGateFadeOut = 0;
					nibuCheck(true);
				}
			}
			if(greenGateFadeOut == 1){
				greenGateButton.opacity -= gatefadeOutSpeed;
				if(greenGateButton.opacity < 0 ){
					greenGateButton.opacity = 1;
					greenGateFadeOut = 0;
					nibuCheck(false);
				}
			}
			if(retryBtnFadeOut == 1){	//リトライ時はフェードしないことにした
				retryBtn.opacity -= 1;
				gameOverBtn.opacity -= 1;
				tweetBtn.opacity -= 1;
				kakuritsuTextEnd.opacity -= 1;
				if(retryBtn.opacity < 0 ){
					retryBtn.opacity = 1;
					gameOverBtn.opacity = 1;
					tweetBtn.opacity = 1;
					kakuritsuTextEnd.opacity = 1;
					retryBtnFadeOut = 0;
					shokika();
				}
			}
			if(eight192FadeIn == 1){	//クリア時のフェードイン
				clearBtn.opacity += fadeOutSpeed/15;
				if(clearBtn.opacity >= 1 ){
					clearBtn.opacity = 1;
					eight192FadeIn = 0;
					omedetoFadeIn1 = 1;	//次のフェードインへ
				}
			}
			if(omedetoFadeIn1 == 1){	
				maxBunboTextClear.opacity += fadeOutSpeed/22;
				kakuritsuBtn.opacity += fadeOutSpeed/22;
				if(maxBunboTextClear.opacity >= 1 ){
					maxBunboTextClear.opacity = 1;
					kakuritsuBtn.opacity = 1;
					omedetoFadeIn1 = 0;
					omedetoFadeIn2 = 1;
				}
			}
			if(omedetoFadeIn2 == 1){	
				commentClearBtn.opacity += fadeOutSpeed/10;
				retryClearBtn.opacity += fadeOutSpeed/5;
				tweetClearBtn.opacity += fadeOutSpeed/5;
				if(commentClearBtn.opacity >= 1 ){
					commentTextClear.opacity = 1;
					retryClearBtn.opacity = 1;
					tweetClearBtn.opacity = 1;
					omedetoFadeIn2 = 0;
				}
			}
			if(clearFadeOut == 1){		//クリア画面からメイン画面へ
				clearBtn.opacity -= fadeOutSpeed/8;
				commentClearBtn.opacity -= fadeOutSpeed/8;
				kakuritsuBtn.opacity -= fadeOutSpeed/8;
				retryClearBtn.opacity -= fadeOutSpeed/8;
				tweetClearBtn.opacity -= fadeOutSpeed/8;
				if(clearBtn.opacity < 0 ){
					clearBtn.opacity = 0;
					commentClearBtn.opacity = 0;
					retryClearBtn.opacity = 0;
					tweetClearBtn.opacity = 0;
					kakuritsuBtn.opacity = 0;
					clearFadeOut = 0;
					shokika();
				}
			}

			//桁増加による表示位置調整
			if(maxBunbo == 1024){
				maxBunboText.moveTo(305, 55);
				maxBunboTextEnd.moveTo(305, 55);
			}
			if(nowBunbo == 128){
				kakuritsuText.moveTo(169, 320);
				kakuritsuTextEnd.moveTo(169, 200);
			}
			if(nowBunbo == 1024){
				kakuritsuText.moveTo(166, 320);
				kakuritsuTextEnd.moveTo(166, 200);
			}
			if(tryCount == 100){
				countNumText.moveTo(41, 55);
				countNumTextClear.moveTo(41, 55);
				countNumTextEnd.moveTo(41, 55);
			}
			if(tryCount == 1000){
				countNumText.moveTo(35, 55);
				countNumTextClear.moveTo(35, 55);
				countNumTextEnd.moveTo(35, 55);
			}
			if(tryCount == 10000){
				countNumText.moveTo(29, 55);
				countNumTextClear.moveTo(29, 55);
				countNumTextEnd.moveTo(29, 55);
			}
		}

		//ゲーム開始状態に戻す
		function shokika(){
			nowBunbo = 1;
			tryCount++;	
			countNumText.text = tryCount;				//メイン画面の試行回数更新
			countNumTextClear.text = tryCount;			//クリア画面の試行回数更新			
			countNumTextEnd.text = tryCount;			//ゲームオーバー画面の試行回数更新
			kakuritsuText.text = ""						//中央表示の確率を消去
			gatefadeOutSpeed = gatefadeOutSpeedMoto;	//ゲートのフェードアウト速度を初期化
			kakuritsuText.moveTo(183, 320);				//桁増加による表示位置調整をもとに戻す
			kakuritsuTextEnd.moveTo(180, 200);			//
			jotai = "main";								//ゲームの状態をメインに（成績表示の戻るボタン用）
			game.popScene();							//現在のシーンを非表示に
			game.pushScene(mainScene);					//メイン画面を表示
		}


		//////スタート画面/////////////////////////////////////////////////////
		const startScene = new Scene();			//シーン作成
		startScene.backgroundColor = "black";	//シーンの背景色
		game.pushScene(startScene);  			//startSceneシーンを表示する ※ここが初期表示

		//タイトル
		const titleBtn = new Sprite(328, 103);
		titleBtn.moveTo(40, 100);
		titleBtn.image = game.assets[titleImg];
		startScene.addChild(titleBtn);

		//スタートボタン
		const startBtn = new Sprite(120, 60);
		startBtn.moveTo(140, 300);
		startBtn.image = game.assets[startImg];
		startScene.addChild(startBtn);

		//スタートボタン処理
		startBtn.ontouchend = function () {		
			startBtnFadeOut = 1;	//フェードアウト開始＋画面遷移
		};


		//////メイン画面////////////////////////////////////////////////////
		const mainScene = new Scene();
		mainScene.backgroundColor = "black"; 

		//試行回数テキスト
		const countText = new Label("試行回数");		 //テキストはLabelクラス
		countText.font = fontStyle;						//フォント設定
		countText.color = fontColor;	   				//フォント色
		countText.width = 150;							//横幅
		countText.moveTo(20, 30);						//表示位置
		mainScene.addChild(countText);					//シーンに追加

		//試行回数表示テキスト
		const countNumText = new Label();
		countNumText.font = fontStyle;
		countNumText.color = fontColor;	
		countNumText.width = 150;
		countNumText.moveTo(48, 55);
		mainScene.addChild(countNumText);

		//確率表示テキスト
		const kakuritsuText = new Label();	
		kakuritsuText.font = fontStyle;
		kakuritsuText.color = fontColor;
		kakuritsuText.width = 150;	
		kakuritsuText.moveTo(183, 320);
		mainScene.addChild(kakuritsuText);	

		//正解履歴表示テキスト
		const rirekiText = new Label();	
		rirekiText.font = fontStyle;
		rirekiText.color = fontColor;
		rirekiText.width = 347;	
		rirekiText.moveTo(20, 365);
		mainScene.addChild(rirekiText);	

		//最大到達分母テキスト
		const maxBunboText = new Label();	
		maxBunboText.font = fontStyle;
		maxBunboText.color = fontColor;
		maxBunboText.width = 150;	
		maxBunboText.moveTo(315, 55);
		mainScene.addChild(maxBunboText);	

		//最大到達点テキスト
		const toutatsuText = new Label("最高到達点");	
		toutatsuText.font = fontStyle;
		toutatsuText.color = fontColor;
		toutatsuText.width = 150;	
		toutatsuText.moveTo(290, 30);
		mainScene.addChild(toutatsuText);

		//青ゲートボタン
		const blueGateButton = new Sprite(117, 166);		//ボタンサイズ
		blueGateButton.moveTo(65, 135);						//ボタンの位置
		blueGateButton.image = game.assets[blueGateImg];	//ボタンに表示する画像
		mainScene.addChild(blueGateButton);	
		
		//緑ゲートボタン
		const greenGateButton = new Sprite(117, 166);
		greenGateButton.moveTo(223, 135);
		greenGateButton.image = game.assets[greenGateImg];
		mainScene.addChild(greenGateButton);

		//ゲートボタン用1/2チェック処理
		let sound = game.assets[clickSndUrl].clone();		//正解用の音を用意
		function nibuCheck(iro){
			var rand =  Math.floor(Math.random()*11);		//ランダム値抽選（0~10の整数）
			if (rand % 2 == 1) {							//奇数だったら1/2成功とする
				sound.play();								//音を鳴らす
				nowBunbo = nowBunbo*2;						//表示用分母を2倍する
				gatefadeOutSpeed = gatefadeOutSpeed/1.5		//ゲートのフェードアウト速度を遅くする
				kakuritsuText.text = "1/" + nowBunbo;
				iroAdd(iro);								//履歴に色を追加
				checkKakuritsu();
			} else {
				iroAdd(!iro);								//フラグを反転させて逆の色を追加する
				kakuritsuTextEnd.text = "1/"+nowBunbo;		//ゲームオーバー画面の表示準備
				rirekiTextEnd.text = rireki;
				jotai = "gameover";			
				game.popScene();
				game.pushScene(endScene);
			}
			if(maxBunbo < nowBunbo){						//以前の最高分母より進んでいたら更新
				maxBunbo = nowBunbo;
			}
			maxBunboTextEnd.text = "1/" + maxBunbo;
			maxBunboText.text = "1/" + maxBunbo;
		}

		//正解履歴に色文字を追加
		function iroAdd(iro){
			if(iro == true){
				rireki = "青" + rireki;		//先頭に追加
			}else{
				rireki = "緑" + rireki;
			}
			rirekiText.text = rireki;
		}

		//到達した確率チェックして記録
		let kaku2 = 0;
		let kaku4 = 0;
		let kaku8 = 0;
		let kaku16 = 0;
		let kaku32 = 0;
		let kaku64 = 0;
		let kaku128 = 0;
		let kaku256 = 0;
		let kaku512 = 0;
		let kaku1024 = 0;
		let kaku2048 = 0;
		let kaku4096 = 0;
		let kaku8192 = 0;
		function checkKakuritsu(){
			if(nowBunbo == 2){ kaku2++; }
			else if(nowBunbo == 4){	kaku4++; }
			else if(nowBunbo == 8){ kaku8++; }
			else if(nowBunbo == 16){ kaku16++; }
			else if(nowBunbo == 32){ kaku32++; }
			else if(nowBunbo == 64){ kaku64++; }
			else if(nowBunbo == 128){ kaku128++; }
			else if(nowBunbo == 256){ kaku256++; }
			else if(nowBunbo == 512){ kaku512++; }
			else if(nowBunbo == 1024){ kaku1024++; }
			else if(nowBunbo == 2048){ kaku2048++; }
			else if(nowBunbo == 4096){ kaku4096++; }
			else if(nowBunbo == 8192){ 	//1/8192の場合はゲームクリア処理も行う
				kaku8192++; 
				jotai = "clear";			
				rirekiTextEndUso.text = rireki;	//偽ゲームオーバー画面の準備
				countNumTextEndUso.text = tryCount;
				game.popScene();
				game.pushScene(endUsoScene);	
			}
		}

		//青ゲートボタンクリック処理
		blueGateButton.ontouchend = function () {	
			blueGateFadeOut = 1;	//フェードアウト開始+1/2チェックフラグ 処理はメインループに記載
		};

		//緑ゲートボタンクリック処理（履歴の記載文字以外は青と同じ）
		greenGateButton.ontouchend = function () {								
			greenGateFadeOut = 1;
		};

		//成績表示ボタン
		const seisekiBtn = new Sprite(120, 42);
		seisekiBtn.moveTo(140, 10);
		seisekiBtn.image = game.assets[seisekiImg];
		mainScene.addChild(seisekiBtn);

		//成績表示処理
		function seisekiHyoji(){
			kaku2Text.text = "1/2 … " + kaku2 +"回";	//成績をラベルに転記
			kaku4Text.text = "1/4 … " + kaku4 +"回";
			kaku8Text.text = "1/8 … " + kaku8 +"回";
			kaku16Text.text = "1/16 … " + kaku16 +"回";
			kaku32Text.text = "1/32 … " + kaku32 +"回";
			kaku64Text.text = "1/64 … " + kaku64 +"回";
			kaku128Text.text = "1/128 … " + kaku128 +"回";
			kaku256Text.text = "1/256 … " + kaku256 +"回";
			kaku512Text.text = "1/512 … " + kaku512 +"回";
			kaku1024Text.text = "1/1024 … " + kaku1024 +"回";
			kaku2048Text.text = "1/2048 … " + kaku2048 +"回";
			kaku4096Text.text = "1/4096 … " + kaku4096 +"回";
			kaku8192Text.text = "1/8192 … " + kaku8192 +"回";
			game.popScene();
			game.pushScene(seisekiScene);	
		}

		//成績表示ボタンクリック処理
		seisekiBtn.ontouchend = function(){
			seisekiHyoji();
		}


		//////成績表示画面////////////////////////////////////////////////////
		const seisekiScene = new Scene();
		seisekiScene.backgroundColor = "black"; 

		//戻るボタン
		const modoruBtn = new Sprite(120, 60);
		modoruBtn.moveTo(140, 10);
		modoruBtn.image = game.assets[modoruImg];
		seisekiScene.addChild(modoruBtn);

		//遷移元に戻る処理
		function modoruShori(doko){
			game.popScene();
			if(doko=="main"){
				game.pushScene(mainScene);	
			}
			else if(doko=="clear"){
				game.pushScene(clearScene);	
			}else{
				game.pushScene(endScene);
			}
		}

		//戻るボタンクリック処理
		modoruBtn.ontouchend = function(){
			modoruShori(jotai);
		}

		//確率テキスト表示
		let kakuX = 35;
		let kakuY = 95;
		let kakuFont = "24px Meiryo";
		let kakuHaba = 200;
		//1/2回数テキスト
		const kaku2Text = new Label();	
		kaku2Text.font = kakuFont;
		kaku2Text.color = fontColor;
		kaku2Text.width = kakuHaba;	
		kaku2Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku2Text);
		//1/4回数テキスト
		const kaku4Text = new Label();	
		kaku4Text.font = kakuFont;
		kaku4Text.color = fontColor;
		kaku4Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku4Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku4Text);
		//1/8回数テキスト
		const kaku8Text = new Label();	
		kaku8Text.font = kakuFont;
		kaku8Text.color = fontColor;
		kaku8Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku8Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku8Text);
		//1/16回数テキスト
		const kaku16Text = new Label();	
		kaku16Text.font = kakuFont;
		kaku16Text.color = fontColor;
		kaku16Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku16Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku16Text);
		//1/32回数テキスト
		const kaku32Text = new Label();	
		kaku32Text.font = kakuFont;
		kaku32Text.color = fontColor;
		kaku32Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku32Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku32Text);
		//1/64回数テキスト
		const kaku64Text = new Label();	
		kaku64Text.font = kakuFont;
		kaku64Text.color = fontColor;
		kaku64Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku64Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku64Text);
		//1/128回数テキスト
		const kaku128Text = new Label();	
		kaku128Text.font = kakuFont;
		kaku128Text.color = fontColor;
		kaku128Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku128Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku128Text);
		//1/256回数テキスト
		const kaku256Text = new Label();	
		kaku256Text.font = kakuFont;
		kaku256Text.color = fontColor;
		kaku256Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku256Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku256Text);
		//1/512回数テキスト
		const kaku512Text = new Label();	
		kaku512Text.font = kakuFont;
		kaku512Text.color = fontColor;
		kaku512Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku512Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku512Text);
		//1/1024回数テキスト
		const kaku1024Text = new Label();	
		kaku1024Text.font = kakuFont;
		kaku1024Text.color = fontColor;
		kaku1024Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku1024Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku1024Text);
		//1/2048回数テキスト
		const kaku2048Text = new Label();	
		kaku2048Text.font = kakuFont;
		kaku2048Text.color = fontColor;
		kaku2048Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku2048Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku2048Text);
		//1/4096回数テキスト
		const kaku4096Text = new Label();	
		kaku4096Text.font = kakuFont;
		kaku4096Text.color = fontColor;
		kaku4096Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku4096Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku4096Text);
		//1/8192回数テキスト
		const kaku8192Text = new Label();	
		kaku8192Text.font = kakuFont;
		kaku8192Text.color = fontColor;
		kaku8192Text.width = kakuHaba;	
		kakuY = kakuY + 30;
		kaku8192Text.moveTo(kakuX, kakuY);
		seisekiScene.addChild(kaku8192Text);


		//////ゲームオーバー画面////////////////////////////////////////////////////
		const endScene = new Scene();
		endScene.backgroundColor = "black";

		//GAMEOVER画像 ※画像だけの貼り付けがわからんかったからボタンに張り付け
		const gameOverBtn = new Sprite(209, 31);
		gameOverBtn.moveTo(90, 150);
		gameOverBtn.image = game.assets[gameoverImg];
		endScene.addChild(gameOverBtn);

		//確率テキスト
		const kakuritsuTextEnd = new Label(); 
		kakuritsuTextEnd.font = fontStyle;
		kakuritsuTextEnd.color = fontColor;
		kakuritsuTextEnd.width = 150;	
		kakuritsuTextEnd.moveTo(180, 200);	
		endScene.addChild(kakuritsuTextEnd);

		//最大到達分母テキスト
		const maxBunboTextEnd = new Label();	
		maxBunboTextEnd.font = fontStyle;
		maxBunboTextEnd.color = fontColor;
		maxBunboTextEnd.width = 150;	
		maxBunboTextEnd.moveTo(315, 55);
		endScene.addChild(maxBunboTextEnd);	

		//最大到達点テキスト
		const toutatsuTextEnd = new Label("最高到達点");	
		toutatsuTextEnd.font = fontStyle;
		toutatsuTextEnd.color = fontColor;
		toutatsuTextEnd.width = 150;	
		toutatsuTextEnd.moveTo(290, 30);
		endScene.addChild(toutatsuTextEnd);

		//試行回数テキスト
		const countTextEnd = new Label("試行回数");
		countTextEnd.font = fontStyle;
		countTextEnd.color = fontColor;
		countTextEnd.width = 150;
		countTextEnd.moveTo(20, 30);
		endScene.addChild(countTextEnd);

		//試行回数表示テキスト
		const countNumTextEnd = new Label(tryCount);
		countNumTextEnd.font = fontStyle;
		countNumTextEnd.color = fontColor;
		countNumTextEnd.width = 150;
		countNumTextEnd.moveTo(48, 55);
		endScene.addChild(countNumTextEnd);

		//履歴表示テキスト
		const rirekiTextEnd = new Label();	
		rirekiTextEnd.font = fontStyle;
		rirekiTextEnd.color = fontColor;
		rirekiTextEnd.width = 347;	
		rirekiTextEnd.moveTo(20, 365);
		endScene.addChild(rirekiTextEnd);

		//リトライボタン
		const retryBtn = new Sprite(120, 60);
		retryBtn.moveTo(50, 280);
		retryBtn.image = game.assets[retryImg];
		endScene.addChild(retryBtn);

		//リトライボタン処理
		retryBtn.ontouchend = function () {		
			retryBtnFadeOut = 1;
		};

		//ポストボタン
		const tweetBtn = new Sprite(120, 60);
		tweetBtn.moveTo(230, 280);
		tweetBtn.image = game.assets[tweetImg];
		endScene.addChild(tweetBtn);

		//ポストボタン処理
		tweetBtn.ontouchend = function () {	
			//ツイッターＡＰＩに送信
			const url = encodeURI("https://karisaito.github.io/garakuta/8192/");
			window.open("http://twitter.com/intent/tweet?text=" +
				"最高1/" + maxBunbo + "まで進んだ！" + url); 
		};

		//成績ボタン（ゲームオーバー画面用）
		const seisekiEndBtn = new Sprite(120, 42);
		seisekiEndBtn.moveTo(140, 10);
		seisekiEndBtn.image = game.assets[seisekiImg];
		endScene.addChild(seisekiEndBtn);

		//成績ボタンクリック処理
		seisekiEndBtn.ontouchend = function () {		
			seisekiHyoji();
		};
	

		//////8192到達失敗？画面////////////////////////////////////////////////////
		const endUsoScene = new Scene();
		endUsoScene.backgroundColor = "black";

		//GAMEOVER画像
		const gameOverUsoBtn = new Sprite(209, 31);
		gameOverUsoBtn.moveTo(90, 150);
		gameOverUsoBtn.image = game.assets[gameoverImg];
		endUsoScene.addChild(gameOverUsoBtn);

		//確率テキスト
		const kakuritsuTextEndUso= new Label(); 
		kakuritsuTextEndUso.font = fontStyle;
		kakuritsuTextEndUso.color = fontColor;
		kakuritsuTextEndUso.width = 150;	
		kakuritsuTextEndUso.moveTo(180, 200);	
		endUsoScene.addChild(kakuritsuTextEndUso);

		//最大到達分母テキスト
		const maxBunboTextEndUso= new Label("1/4096↑");	
		maxBunboTextEndUso.font = fontStyle;
		maxBunboTextEndUso.color = fontColor;
		maxBunboTextEndUso.width = 150;	
		maxBunboTextEndUso.moveTo(305, 55);
		endUsoScene.addChild(maxBunboTextEndUso);	

		//最大到達点テキスト
		const toutatsuTextEndUso = new Label("最高到達点");	
		toutatsuTextEndUso.font = fontStyle;
		toutatsuTextEndUso.color = fontColor;
		toutatsuTextEndUso.width = 150;	
		toutatsuTextEndUso.moveTo(290, 30);
		endUsoScene.addChild(toutatsuTextEndUso);

		//試行回数テキスト
		const countTextEndUso = new Label("試行回数");
		countTextEndUso.font = fontStyle;
		countTextEndUso.color = fontColor;
		countTextEndUso.width = 150;
		countTextEndUso.moveTo(20, 30);
		endUsoScene.addChild(countTextEndUso);

		//試行回数表示テキスト
		const countNumTextEndUso = new Label();
		countNumTextEndUso.font = fontStyle;
		countNumTextEndUso.color = fontColor;
		countNumTextEndUso.width = 150;
		countNumTextEndUso.moveTo(48, 55);
		endUsoScene.addChild(countNumTextEndUso);

		//履歴表示テキスト
		const rirekiTextEndUso = new Label();	
		rirekiTextEndUso.font = fontStyle;
		rirekiTextEndUso.color = fontColor;
		rirekiTextEndUso.width = 347;	
		rirekiTextEndUso.moveTo(20, 365);
		endUsoScene.addChild(rirekiTextEndUso);

		//再確認ボタン
		const retryUsoBtn = new Sprite(120, 60);
		retryUsoBtn.moveTo(50, 280);
		retryUsoBtn.image = game.assets[kakuninImg];
		endUsoScene.addChild(retryUsoBtn);

		//再確認ボタン処理
		retryUsoBtn.ontouchend = function () {		
			game.popScene();
			game.pushScene(clearScene);	//本当のクリア画面に遷移
			eight192FadeIn = 1;	
		};

		//ポストボタン（クリックしても処理は行わない）
		const tweetUsoBtn = new Sprite(120, 60);
		tweetUsoBtn.moveTo(230, 280);
		tweetUsoBtn.image = game.assets[tweetImg];
		endUsoScene.addChild(tweetUsoBtn);

		//成績ボタン（クリックしても処理は行わない）
		const seisekiEndUsoBtn = new Sprite(120, 42);
		seisekiEndUsoBtn.moveTo(140, 10);
		seisekiEndUsoBtn.image = game.assets[seisekiImg];
		endUsoScene.addChild(seisekiEndUsoBtn);


		//////8192到達画面////////////////////////////////////////////////////
		const clearScene = new Scene();
		clearScene.backgroundColor = "white";

		//クリア画像
		const clearBtn = new Sprite(209, 31);
		clearBtn.moveTo(92, 150);
		clearBtn.image = game.assets[clearImg];
		clearScene.addChild(clearBtn);
		clearBtn.opacity = 0;

		//クリア画面用フォント設定
		let clearFontColor = "black";

		//8192表示
		const kakuritsuBtn = new Sprite(140, 53);
		kakuritsuBtn.moveTo(132, 190);	
		kakuritsuBtn.image = game.assets[end8192Img];
		clearScene.addChild(kakuritsuBtn);
		kakuritsuBtn.opacity = 0;

		//最大到達分母テキスト
		const maxBunboTextClear = new Label("1/8192");	
		maxBunboTextClear.font = fontStyle;
		maxBunboTextClear.color = "red";
		maxBunboTextClear.width = 150;	
		maxBunboTextClear.moveTo(305, 55);
		clearScene.addChild(maxBunboTextClear);	
		maxBunboTextClear.opacity = 0;

		//最大到達点テキスト
		const toutatsuTextClear = new Label("最高到達点");	
		toutatsuTextClear.font = fontStyle;
		toutatsuTextClear.color = clearFontColor;
		toutatsuTextClear.width = 150;	
		toutatsuTextClear.moveTo(290, 30);
		clearScene.addChild(toutatsuTextClear);

		//試行回数テキスト
		const countTextClear = new Label("試行回数");
		countTextClear.font = fontStyle;
		countTextClear.color = clearFontColor;
		countTextClear.width = 150;
		countTextClear.moveTo(20, 30);
		clearScene.addChild(countTextClear);

		//試行回数表示テキスト
		const countNumTextClear = new Label(tryCount);
		countNumTextClear.font = fontStyle;
		countNumTextClear.color = clearFontColor;
		countNumTextClear.width = 150;
		countNumTextClear.moveTo(48, 55);
		clearScene.addChild(countNumTextClear);

		//履歴表示テキスト
		const rirekiTextClear = new Label();	
		rirekiTextClear.font = fontStyle;
		rirekiTextClear.color = clearFontColor;
		rirekiTextClear.width = 347;	
		rirekiTextClear.moveTo(20, 365);
		clearScene.addChild(rirekiTextClear);

		//クリアテキスト
		//クリアテキスト
		const commentClearBtn = new Sprite(355, 44);
		commentClearBtn.image = game.assets[thanksClearImg];
		commentClearBtn.moveTo(25, 460);
		clearScene.addChild(commentClearBtn);
		commentClearBtn.opacity = 0;

		//リトライボタン
		const retryClearBtn = new Sprite(120, 60);
		retryClearBtn.moveTo(50, 280);
		retryClearBtn.image = game.assets[retryImg];
		clearScene.addChild(retryClearBtn);
		retryClearBtn.opacity = 0;

		//リトライボタン処理
		retryClearBtn.ontouchend = function () {		
			clearFadeOut = 1;
		};

		//ポストボタン
		const tweetClearBtn = new Sprite(120, 60);
		tweetClearBtn.moveTo(230, 280);
		tweetClearBtn.image = game.assets[tweetImg];
		clearScene.addChild(tweetClearBtn);
		tweetClearBtn.opacity = 0;

		//ポストボタン処理
		tweetClearBtn.ontouchend = function () {	
			//ツイッターＡＰＩに送信
			const url = encodeURI("https://karisaito.github.io/garakuta/8192/");
			window.open("http://twitter.com/intent/tweet?text=" +
				"1/8192を達成した！すごい！！" + url); 
		};

		//成績ボタン（ゲームオーバー画面用）
		const seisekiClearBtn = new Sprite(120, 42);
		seisekiClearBtn.moveTo(140, 10);
		seisekiClearBtn.image = game.assets[seisekiImg];
		clearScene.addChild(seisekiClearBtn);

		//成績ボタンクリック処理
		seisekiClearBtn.ontouchend = function () {		
			seisekiHyoji();
		};

	};

	game.start();
};