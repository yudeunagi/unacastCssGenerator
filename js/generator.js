//セーブ＆ロード機能とかあるといいかもね
//もしくはCSSを貼り付けてロードするとか。
///////////////////////////////////////
////便利関数////
///////////////////////////////////////
//#FF00FF みたいなコードを 配列[255, 0, 255]みたいな感じで返す
function hexToRGB(hex) {
  //#ff00ff みたいなコードを3分割
  //（実際には配列の先頭は元の文字列が入るので[#ff00ff, ff, 00, ff]みたいになる）
  let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  let c = null
  if (r) {
    //配列のインデックス 1から3（4は含まない）に対して10進数変換する
    c = r.slice(1,4).map(function(x) { return parseInt(x, 16) })
    return c;
  }
  return null;
}

//縁取りCSS作成用 -2px -2px #333333,みたいな奴をループで作る
function generateTextShadowCss(size, color){

　//0の時はtext-shadowを打ち消すCSSを出力する
  if(size == '0'){
    return '0px 0px';
  };

  //ループで文字列を作成
　var result = '';
  for(var i = size * -1; i <= size; i++){
    for(var j = size * -1; j <= size; j++){
      result += `${i}px ${j}px ${color},`;
    }
  }
  //末尾の,を;に変換
  result = result.replace(/,$/,'');
  return result;
}

//フォームの有効/無効切り替え
function toggleTargetForm(obj){
  var ch = obj.checked;
  var tgt = obj.getAttribute('terget');

  $(`#${tgt}`).prop('disabled', !ch);

}

//表示日表示切替
function toggleTargetDisp(obj){

  //対象クラス取得
  var targetClass = obj.getAttribute('targetclass');
  //表示タイプ取得
  var dispType = obj.getAttribute('disptype');
  //チェック状態取得
  var checked = obj.checked;

  if(checked)
  {
    $(`${targetClass}`).css( { 'display' : `${dispType}` });
  }
  else
  {
    $(`${targetClass}`).css( { 'display' : 'none' });
  }
}

///////////////////////////////////////
////全般変更////
///////////////////////////////////////
var baseCss = ''; //CSS出力用変数
var rgba = 'rgba(0, 0, 0, 0.2)'; //背景色デフォルト
//背景色変更
function inputBgColor(color) {
  var bgColor = hexToRGB($("#base-bg-color").val()); //カラーピッカーで選択したrgbを配列で取得
  var bgAlpha = $("#base-bg-alpha").val() / 100; //スライダの値 / 100

  // バッククォート(`)はシングル、ダブルクォートと同じように使えるし
  // その中で${変数名} って書くと変数使えるけど存在に慣れない。
  rgba = `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${bgAlpha})`;

  $("div#parent").css( { 'background-color' : rgba });
}

//レスサイズ変更、行の高さも変更する
function inputBaseSize() {
  //サイズ取得
  var size = $('#base-size').val();
  $("body").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
}

//ボーダーカラー変更
var baseShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var baseBdSize = '1';
function inputBaseBorder() {
  var s = $('#base-bd-size').val();
  var col = $('#base-bd-color').val();

  baseShadow = generateTextShadowCss(s,col);
  $("body").css( { 'text-shadow' : baseShadow});
}

//入力完了時にCSS出力
function changeBase() {
  var bgColor = $("#bg-color").val();
  var baseSize = $("#base-size").val();
  var baseHeight = Math.ceil(baseSize * 1.3);

  baseCss =
  '/*全般的な設定です*/' + '\n' +
  'body {' + '\n' +
  '  background-color:' + rgba + ';' + '\n' +
  '  font-size:' + baseSize + 'px;' + '\n' +
  '  line-height:' + baseHeight + 'px;' + '\n' +
  '  text-shadow:' + baseShadow + ';' + '\n' +
  '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////アイコン表示部変更////
///////////////////////////////////////
var iconCss = ''; //CSS出力用変数

//アイコンサイズ変更
function inputIconSize(size){
  $("img.icon").css( {'width' : size+'px', 'height' : size+'px'});
  $(".icon-block").css( {'width' : size+'px'});
}

//アイコン角丸度変更
function inputIconRadius(val){
  $("img.icon").css( {'border-radius' : val+'%'});
}

//アイコン余白変更
function inputIconMargin(val){
  $(".icon-block").css( {'margin-right' : (val / 10.0)+'em'});
}

//入力完了時にCSS出力
function changeIcon() {
  var iconSize = $("#icon-size").val();
  var iconRadius = $("#icon-radius").val();
  var iconMargin = $("#icon-margin").val();
  iconMargin /= 10.0;
  console.log(iconMargin);
//iconMargin = 0.2;
  iconCss =
  '' + '\n' +
  '/*アイコンの設定です*/' + '\n' +
  'img.icon {' + '\n' +
  '  width:' + iconSize + 'px;' + '\n' +
  '  height:' + iconSize + 'px;' + '\n' +
  '  border-radius:' + iconRadius + '%;' + '\n' +
  '}' + '\n' +
  '\n' +
  '.icon-block {' + '\n' +
  '  width:' + iconSize + 'px;' + '\n' +
  '  margin-right:' + iconMargin + 'em;' + '\n' +
  '}' + '\n';

  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////レス表示部変更////
///////////////////////////////////////
var resCss = ''; //CSS出力用変数
//レスカラー変更
function inputResColor() {
  var color = $('#res-color').val();
  if($('#res-color-inherit').prop('checked'))
  {
    //ピッカーの値を取得
    $(".res").css( { 'color' : color });
  }
  else
  {
    //ピッカーの値を取得
    $(".res").css( { 'color' : 'inherit' });
  }
}

//レスサイズ変更、行の高さも変更する
function inputResSize() {
  //サイズ取得
  var size = $('#res-size').val();
  if($('#res-size-inherit').prop('checked'))
  {
    //継承しないならスラーダーの値を設定。
    $(".res").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
  }
  else
  {
    //継承設定なら継承
    $(".res").css( { 'font-size' : 'inherit' ,'line-height' : 'inherit'});
  }
}
//ボーダーカラー変更
var resShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var resBdSize = '1';
function inputResBorder() {
  var s = $('#res-bd-size').val();
  var col = $('#res-bd-color').val();

  if($('#res-bd-size-inherit').prop('checked')){
    resShadow = generateTextShadowCss(s,col);
    $(".res").css( { 'text-shadow' : resShadow});
  }
  else
  {
    $(".res").css( { 'text-shadow' : 'inherit'});
  }

}

//入力完了時にCSS出力
function changeRes() {
  var size = $('#res-size').val();

  var resColor = $("#res-color").val();
  var resSize = $("#res-size").val();
  var resHeight = Math.ceil(resSize * 1.3);
  resCss =
  '' + '\n' +
  '/*レス表示部分の設定です*/' + '\n' +
  '.res {' + '\n' ;

  //文字色を個別設定の場合出力
  if($('#res-color-inherit').prop('checked'))
  {
    resCss += '  color:' + resColor + ';' + '\n' ;
  }
  //文字サイズを個別設定の場合出力
  if($('#res-size-inherit').prop('checked'))
  {
    resCss +=
    '  font-size:' + resSize + 'px;' + '\n' +
    '  line-height:' + resHeight + 'px;' + '\n';
  }
  if($('#res-bd-size-inherit').prop('checked'))
  {
    resCss += '  text-shadow:' + resShadow + ';' + '\n';
  }

  resCss += '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////レス番号表示部変更////
///////////////////////////////////////
var numCss = ''; //CSS出力用変数
//レス番カラー変更
function inputNumberColor() {
  var color = $('#number-color').val();
  if($('#number-color-inherit').prop('checked'))
  {
    //ピッカーの値を取得
    $(".resNumber").css( { 'color' : color });
  }
  else
  {
    //ピッカーの値を取得
    $(".resNumber").css( { 'color' : '#55ff55' });
  }
}

//レス番サイズ変更、行の高さも変更する
function inputNumberSize() {
  //サイズ取得
  var size = $('#number-size').val();
  if($('#number-size-inherit').prop('checked'))
  {
    //継承しないならスラーダーの値を設定。
    $(".resNumber").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
  }
  else
  {
    //継承設定なら継承
    $(".resNumber").css( { 'font-size' : 'inherit' ,'line-height' : 'inherit'});
  }
}
//ボーダーカラー変更
var numberShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var numberBdSize = '1';
function inputNumberBorder() {
  var s = $('#number-bd-size').val();
  var col = $('#number-bd-color').val();

  if($('#number-bd-size-inherit').prop('checked')){
    numberShadow = generateTextShadowCss(s,col);
    $(".resNumber").css( { 'text-shadow' : numberShadow});
  }
  else
  {
    $(".resNumber").css( { 'text-shadow' : 'inherit'});
  }

}
//入力完了時にCSS出力
function changeNumber() {
  var numColor = $("#number-color").val();
  var numSize = $("#number-size").val();
  var numHeight = Math.ceil(numSize * 1.3);
  numCss =
  '' + '\n' +
  '/*レス番号表示部分の設定です*/' + '\n' +
  '.resNumber {' + '\n';

  //文字色を個別設定の場合出力
  if($('#number-color-inherit').prop('checked'))
  {
    numCss += '  color:' + numColor + ';' + '\n' ;
  }
  //文字サイズを個別設定の場合出力
  if($('#number-size-inherit').prop('checked'))
  {
    numCss +=
    '  font-size:' + numSize + 'px;' + '\n' +
    '  line-height:' + numHeight + 'px;' + '\n';
  }
  if($('#number-bd-size-inherit').prop('checked'))
  {
    numCss += '  text-shadow:' + numberShadow + ';' + '\n';
  }

  numCss += '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////名前表示部変更////
///////////////////////////////////////
var nameCss = ''; //CSS出力用変数
//名前カラー変更
function inputNameColor() {
  var color = $('#name-color').val();
  if($('#name-color-inherit').prop('checked'))
  {
    //ピッカーの値を取得
    $(".name").css( { 'color' : color });
  }
  else
  {
    //ピッカーの値を取得
    $(".name").css( { 'color' : '#55ff55' });
  }
}

//名前サイズ変更、行の高さも変更する
function inputNameSize() {
  //サイズ取得
  var size = $('#name-size').val();
  if($('#name-size-inherit').prop('checked'))
  {
    //継承しないならスラーダーの値を設定。
    $(".name").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
  }
  else
  {
    //継承設定なら継承
    $(".name").css( { 'font-size' : 'inherit' ,'line-height' : 'inherit'});
  }
}
//ボーダーカラー変更
var nameShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var nameBdSize = '1';
function inputNameBorder() {
  var s = $('#name-bd-size').val();
  var col = $('#name-bd-color').val();

  if($('#name-bd-size-inherit').prop('checked')){
    nameShadow = generateTextShadowCss(s,col);
    $(".name").css( { 'text-shadow' : nameShadow});
  }
  else
  {
    $(".name").css( { 'text-shadow' : 'inherit'});
  }

}
//入力完了時にCSS出力
function changeName() {
  var nameColor = $("#name-color").val();
  var nameSize = $("#name-size").val();
  var nameHeight = Math.ceil(nameSize * 1.3);
  nameCss =
  '' + '\n' +
  '/*名前部分の設定です*/' + '\n' +
  '.name {' + '\n';

  //文字色を個別設定の場合出力
  if($('#name-color-inherit').prop('checked'))
  {
    nameCss += '  color:' + nameColor + ';' + '\n' ;
  }
  //文字サイズを個別設定の場合出力
  if($('#name-size-inherit').prop('checked'))
  {
    nameCss +=
    '  font-size:' + nameSize + 'px;' + '\n' +
    '  line-height:' + nameHeight + 'px;' + '\n';
  }
  if($('#name-bd-size-inherit').prop('checked'))
  {
    nameCss += '  text-shadow:' + nameShadow + ';' + '\n';
  }

  nameCss += '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////日付表示部変更////
///////////////////////////////////////
var dateCss = ''; //CSS出力用変数
//名前カラー変更
function inputDateColor() {
  var color = $('#date-color').val();
  if($('#date-color-inherit').prop('checked'))
  {
    //ピッカーの値を取得
    $(".date").css( { 'color' : color });
  }
  else
  {
    //ピッカーの値を取得
    $(".date").css( { 'color' : '#feffa0' });
  }
}

//名前サイズ変更、行の高さも変更する
function inputDateSize() {
  //サイズ取得
  var size = $('#date-size').val();
  console.log(size);
  if($('#date-size-inherit').prop('checked'))
  {
    //継承しないならスラーダーの値を設定。
    $(".date").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
  }
  else
  {
    //継承設定なら継承
    $(".date").css( { 'font-size' : '0.8em' ,'line-height' : 'inherit'});
  }
}
//ボーダーカラー変更
var dateShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var dateBdSize = '1';
function inputDateBorder() {
  var s = $('#date-bd-size').val();
  var col = $('#date-bd-color').val();

  if($('#date-bd-size-inherit').prop('checked')){
    dateShadow = generateTextShadowCss(s,col);
    $(".date").css( { 'text-shadow' : dateShadow});
  }
  else
  {
    $(".date").css( { 'text-shadow' : 'inherit'});
  }

}
//入力完了時にCSS出力
function changeDate() {
  var dateColor = $("#date-color").val();
  var dateSize = $("#date-size").val();
  var dateHeight = Math.ceil(dateSize * 1.3);
  dateCss =
  '' + '\n' +
  '/*日付部分の設定です*/' + '\n' +
  '.date {' + '\n';

  //文字色を個別設定の場合出力
  if($('#date-color-inherit').prop('checked'))
  {
    dateCss += '  color:' + dateColor + ';' + '\n' ;
  }
  //文字サイズを個別設定の場合出力
  if($('#date-size-inherit').prop('checked'))
  {
    dateCss +=
    '  font-size:' + dateSize + 'px;' + '\n' +
    '  line-height:' + dateHeight + 'px;' + '\n';
  }
  if($('#date-bd-size-inherit').prop('checked'))
  {
    dateCss += '  text-shadow:' + dateShadow + ';' + '\n';
  }

  dateCss += '}' + '\n';
  //CSS出力
  outputCSS();
}


//CSS出力
function outputCSS()
{
  //テキストエリアへ反映
  var result = baseCss + iconCss + resCss + numCss + nameCss + dateCss;
  //console.log(result);
  $("#outputText").val(result);
}
