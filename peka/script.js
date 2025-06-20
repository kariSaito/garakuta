enchant();

window.onload = function () {
	
	//画面サイズ
	const game = new Game(400, 500);  	

	//ファイルパスの定義
	const titleImg = "img/title.png";		//タイトル画像
	const startImg = "img/start.png";		//開始ボタン画像
	const pekaOto = "sound/gogo.mp3";		//ペカ音
	const buttonImg = "img/button.png";		//タイトル画像
	const gogoOffImg = "img/gogoOff.png";	//ランプ（OFF）画像
	const gogoOnImg = "img/gogoOn.png";		//ランプ（ON）画像
	const plus1Img = "img/plus1.png";		//+1ボタン画像
	const plus10Img = "img/plus10.png";		//+10ボタン画像
	const plus100Img = "img/plus100.png";	//+100ボタン画像
	const kaisiGImg = "img/kaisiG.png";		//開始画面ボタン画像
	const shokyoImg = "img/shokyo.png";		//消去ボタン画像

	//ファイルをロードする
	game.preload([titleImg]);
	game.preload([startImg]);
	game.preload([pekaOto]); 
	game.preload([buttonImg]);
	game.preload([gogoOffImg]);
	game.preload([gogoOnImg]);
	game.preload([plus1Img]);
	game.preload([plus10Img]);	
	game.preload([plus100Img]);	
	game.preload([kaisiGImg]);	
	game.preload([shokyoImg]);	

	game.onload = function () {	//ロード後にこの関数が呼び出される
		let tryCount = 0;				//試行回数
		let pekaCount = 0; 				//当選数
		let kakuritsu = 1;				//現在の抽選確率

		let fontStyle = "20px Meiryo";			 //フォント
		let fontColor = 'rgba(255,255,255,1)';	//フォント色（RGB+透明度）

		let startBtnFadeOut = 0;		//フェードアウト用フラグ
		let fadeOutSpeed = 0.2;			//フェードアウト速度


		//メインループ 各フラグを待機 ※1フレームごとに呼び出される/////////////////////////////////////
		game.onenterframe = function(){

			if(startBtnFadeOut == 1){				//ボタンによってフラグが立ったら
				startBtn.opacity -= fadeOutSpeed/4;	//不透明度を減らす
				titleBtn.opacity -= fadeOutSpeed/4;
				kakuText.opacity -= fadeOutSpeed/4;
				plus1Btn.opacity -= fadeOutSpeed/4;
				plus10Btn.opacity -= fadeOutSpeed/4;
				plus100Btn.opacity -= fadeOutSpeed/4;
				syokyoBtn.opacity -= fadeOutSpeed/4;
				if(startBtn.opacity <= 0 ){			//完全に消えたら元に戻す+その後の動作を実行
					startBtn.opacity = 1;
					titleBtn.opacity = 1;
					kakuText.opacity = 1;
					plus1Btn.opacity = 1;
					plus10Btn.opacity = 1;
					plus100Btn.opacity = 1;
					syokyoBtn.opacity = 1;
					startBtnFadeOut = 0;
					shokika();
				}
			}

		}

		//ゲーム開始状態に戻す
		function shokika(){
			nowKakuritsuText.text = "抽選確率：1/" + kakuritsu;
			gogoButton.image = game.assets[gogoOffImg];			//ランプをオフに
			tryCount = 0;
			countNumText.text = tryCount;
			pekaCount = 0;
			pekariNumText.text = pekaCount;
			countNumText.moveTo(60, 55);
			pekariNumText.moveTo(327, 55);
			game.popScene();
			game.pushScene(mainScene);
		}


		//////スタート画面/////////////////////////////////////////////////////
		const startScene = new Scene();			//シーン作成
		startScene.backgroundColor = "black";	//シーンの背景色
		game.pushScene(startScene);  			//startSceneシーンを表示する ※ここが初期表示

		//タイトル
		const titleBtn = new Sprite(328, 103);
		titleBtn.moveTo(40, 75);
		titleBtn.image = game.assets[titleImg];
		startScene.addChild(titleBtn);

		//抽選確率テキスト
		const kakuText = new Label("1/1");	
		kakuText.font = "28px 游明朝 Demibold";	
		kakuText.color = fontColor;
		kakuText.width = 150;
		kakuText.moveTo(181, 220);	
		startScene.addChild(kakuText);

		//+処理
		function plusNkai(kai){
			kakuritsu = kakuritsu + kai;
			kakuText.text = "1/" + kakuritsu;
			if(kakuritsu >= 10){	//桁数による表示位置補正
				kakuText.moveTo(172, 220)
				nowKakuritsuText.moveTo(122, 470);
			}			
			if(kakuritsu >= 100){
				kakuText.moveTo(165, 220)
				nowKakuritsuText.moveTo(114, 470);
			}
			if (kakuritsu >= 1000){
				kakuText.moveTo(158, 220)
				nowKakuritsuText.moveTo(107, 470);
			}
			if (kakuritsu >= 10000){
				kakuText.moveTo(151, 220)
				nowKakuritsuText.moveTo(100, 470);
			}
		}

		//+ボタン表示位置
		let plusBtnX = 90;
		let plusBtnY = 260;

		//+1ボタン
		const plus1Btn = new Sprite(73, 60);
		plus1Btn.moveTo(plusBtnX, plusBtnY);
		plus1Btn.image = game.assets[plus1Img];
		startScene.addChild(plus1Btn);
		//+1ボタン処理
		plus1Btn.ontouchend = function () {		
			plusNkai(1);
		};

		//+10ボタン
		const plus10Btn = new Sprite(73, 60);
		plusBtnX = plusBtnX + 75;
		plus10Btn.moveTo(plusBtnX, plusBtnY);
		plus10Btn.image = game.assets[plus10Img];
		startScene.addChild(plus10Btn);
		//+10ボタン処理
		plus10Btn.ontouchend = function () {		
			plusNkai(10);
		};

		//+100ボタン
		const plus100Btn = new Sprite(73, 60);
		plusBtnX = plusBtnX + 75;
		plus100Btn.moveTo(plusBtnX, plusBtnY);
		plus100Btn.image = game.assets[plus100Img];
		startScene.addChild(plus100Btn);
		//+100ボタン処理
		plus100Btn.ontouchend = function () {		
			plusNkai(100);
		};

		//消去ボタン
		const syokyoBtn = new Sprite(120, 42);
		syokyoBtn.moveTo(143, 320);
		syokyoBtn.image = game.assets[shokyoImg];
		startScene.addChild(syokyoBtn);
		//消去ボタンクリック処理
		syokyoBtn.ontouchend = function(){
			kakuritsu = 1;
			kakuText.text = "1/" + kakuritsu;
			kakuText.moveTo(181, 220);	
		}

		//開始ボタン
		const startBtn = new Sprite(120, 60);
		startBtn.moveTo(143, 390);
		startBtn.image = game.assets[startImg];
		startScene.addChild(startBtn);

		//開始ボタン処理
		startBtn.ontouchend = function () {		
			startBtnFadeOut = 1;	//フェードアウト開始＋画面遷移
		};


		//////メイン画面////////////////////////////////////////////////////
		const mainScene = new Scene();
		mainScene.backgroundColor = "black"; 

		//回転数テキスト
		const countText = new Label("回転数");		 //テキストはLabelクラス
		countText.font = fontStyle;					//フォント設定
		countText.color = fontColor;	   			//フォント色
		countText.width = 150;						//横幅
		countText.moveTo(35, 30);					//表示位置
		mainScene.addChild(countText);				//シーンに追加

		//回転数表示テキスト
		const countNumText = new Label("0");
		countNumText.font = fontStyle;
		countNumText.color = fontColor;	
		countNumText.width = 150;
		countNumText.moveTo(60, 55);
		mainScene.addChild(countNumText);

		//現在の抽選確率テキスト
		const nowKakuritsuText = new Label("抽選確率：1/2");	
		nowKakuritsuText.font = fontStyle;
		nowKakuritsuText.color = fontColor;
		nowKakuritsuText.width = 200;	
		nowKakuritsuText.moveTo(130, 470);
		mainScene.addChild(nowKakuritsuText);	

		//ぺカリ数テキスト
		const pekariText = new Label("当選回数");	
		pekariText.font = fontStyle;
		pekariText.color = fontColor;
		pekariText.width = 150;	
		pekariText.moveTo(293, 30);
		mainScene.addChild(pekariText);

		//ぺカリ数表示テキスト
		const pekariNumText = new Label("0");	
		pekariNumText.font = fontStyle;
		pekariNumText.color = fontColor;
		pekariNumText.width = 150;	
		pekariNumText.moveTo(327, 55);
		mainScene.addChild(pekariNumText);	

		//GOGOランプボタン
		const gogoButton = new Sprite(240, 260);		//ボタンサイズ
		gogoButton.moveTo(80, 100);						//ボタンの位置
		gogoButton.image = game.assets[gogoOffImg];		//ボタンに表示する画像
		mainScene.addChild(gogoButton);	
		
		//リール停止ボタン
		const stopButton = new Sprite(69, 56);
		stopButton.moveTo(163, 370);
		stopButton.image = game.assets[buttonImg];
		mainScene.addChild(stopButton);
		//リール停止ボタンクリック処理
		stopButton.ontouchend = function () {	
			pekaCheck();
			if(tryCount >= 10){	//桁数による表示位置補正（回転数）
				countNumText.moveTo(53, 55);
			}			
			if(tryCount >= 100){
				countNumText.moveTo(46, 55);
			}
			if (tryCount >= 1000){
				countNumText.moveTo(39, 55);
			}
			if (tryCount >= 10000){
				countNumText.moveTo(32, 55);
			}
			if(pekaCount >= 10){	//桁数による表示位置補正（当選回数）
				pekariNumText.moveTo(320, 55);
			}			
			if(pekaCount >= 100){
				pekariNumText.moveTo(313, 55);
			}
			if (pekaCount >= 1000){
				pekariNumText.moveTo(306, 55);
			}
			if (pekaCount >= 10000){
				pekariNumText.moveTo(299, 55);
			}

		};

		//停止ボタン用確率チェック処理
		let sound = game.assets[pekaOto].clone();		//当選用の音を用意
		let rand = 0;									//ランダム値用
		function pekaCheck(){
			tryCount++;
			countNumText.text = tryCount;
			rand =  Math.floor(Math.random()*(kakuritsu -1+1) +1 );	//ランダム値抽選（1~nの整数）
			if (rand  == 1) {										//1だったら1/kakuritsu成功とする
				sound.play();
				pekaCount++;
				pekariNumText.text = pekaCount;
				gogoButton.image = game.assets[gogoOnImg];	
			} else {
				gogoButton.image = game.assets[gogoOffImg];	
			}
		}

		//開始画面ボタン
		const kaisiGBtn = new Sprite(120, 42);
		kaisiGBtn.moveTo(140, 22);
		kaisiGBtn.image = game.assets[kaisiGImg];
		mainScene.addChild(kaisiGBtn);
		//開始画面ボタンクリック処理
		kaisiGBtn.ontouchend = function(){
			game.popScene();
			game.pushScene(startScene);	
		}

	};

	game.start();
};