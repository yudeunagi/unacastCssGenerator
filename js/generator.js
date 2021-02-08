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

function toggleTergetForm(obj){
  var ch = obj.checked;
  var tgt = obj.getAttribute('terget');

  $(`#${tgt}`).prop('disabled', !ch);

}


///////////////////////////////////////
////全般変更////
///////////////////////////////////////
var resGeneral = ''; //CSS出力用変数
var rgba = 'rgba(0, 0, 0, 0.2)'; //背景色デフォルト
//背景色変更
function inputBgColor(color) {
  var bgColor = hexToRGB($("#bg-color").val()); //カラーピッカーで選択したrgbを配列で取得
  var bgAlpha = $("#bg-alpha").val() / 100; //スライダの値 / 100

  // バッククォート(`)はシングル、ダブルクォートと同じように使えるし
  // その中で${変数名} って書くと変数使えるけど存在に慣れない。
  rgba = `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${bgAlpha})`;

  $("body").css( { 'background-color' : rgba });
}
//入力完了字にCSS出力
function changeGeneral() {
  var bgColor = $("#bg-color").val();
  resGeneral =
  '/*全般的な設定です*/' + '\n' +
  'body {' + '\n' +
  '  background-color:' + rgba + ';' + '\n' +
  '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////レス表示部変更////
///////////////////////////////////////
var resCss = ''; //CSS出力用変数
//レスカラー変更
function inputResColor(color) {
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
function inputResSize(size) {
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
//レスサイズ変更、行の高さも変更する
function inputNumSize(size) {
  $(".resNumber").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
//  console.log(size);
}
//レスカラー変更
function inputNumColor(color) {
  $(".resNumber").css( { 'color' : color });
}

//ボーダーカラー変更
var numShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var numBdSize = '1';
function inputNumBdColor(color) {
  var s = numBdSize;
  numShadow = `${s}px ${s}px 0 ${color}, -${s}px ${s}px 0 ${color}, ${s}px -${s}px 0 ${color}, -${s}px -${s}px 0 ${color}`
  $(".resNumber").css( { 'text-shadow' : numShadow});
//  $(".res").css( { 'text-stroke' : `${s}px ${color}`}); //text-strokeだと見た目がいまいち
//  text-shadow: 1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333;

}

//入力完了時にCSS出力
function changeNum() {
  var numColor = $("#num-color").val();
  var numSize = $("#num-size").val();
  var numHeight = Math.ceil(numSize * 1.3);
  numCss =
  '' + '\n' +
  '/*レス番号表示部分の設定です*/' + '\n' +
  '.resNumber {' + '\n' +
  '  color:' + numColor + ';' + '\n' +
  '  font-size:' + numSize + 'px;' + '\n' +
  '  line-height:' + numHeight + 'px;' + '\n' +
  '  text-shadow:' + numShadow + ';' + '\n' +
  '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////名前表示部変更////
///////////////////////////////////////
var nameCss = ''; //CSS出力用変数
//レスサイズ変更、行の高さも変更する
function inputNameSize(size) {
  $(".name").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
//  console.log(size);
}
//レスカラー変更
function inputNameColor(color) {
  $(".name").css( { 'color' : color });
}

//ボーダーカラー変更
var nameShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var nameBdSize = '1';
function inputNameBdColor(color) {
  var s = nameBdSize;
  nameShadow = `${s}px ${s}px 0 ${color}, -${s}px ${s}px 0 ${color}, ${s}px -${s}px 0 ${color}, -${s}px -${s}px 0 ${color}`
  $(".name").css( { 'text-shadow' : nameShadow});
//  $(".res").css( { 'text-stroke' : `${s}px ${color}`}); //text-strokeだと見た目がいまいち
//  text-shadow: 1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333;

}

//入力完了時にCSS出力
function changeName() {
  var nameColor = $("#name-color").val();
  var nameSize = $("#name-size").val();
  var nameHeight = Math.ceil(nameSize * 1.3);
  nameCss =
  '' + '\n' +
  '/*レス番号表示部分の設定です*/' + '\n' +
  '.name {' + '\n' +
  '  color:' + nameColor + ';' + '\n' +
  '  font-size:' + nameSize + 'px;' + '\n' +
  '  line-height:' + nameHeight + 'px;' + '\n' +
  '  text-shadow:' + nameShadow + ';' + '\n' +
  '}' + '\n';
  //CSS出力
  outputCSS();
}

///////////////////////////////////////
////日付表示部変更////
///////////////////////////////////////
var dateCss = ''; //CSS出力用変数
//レスサイズ変更、行の高さも変更する
function inputDateSize(size) {
  $(".date").css( { 'font-size' : size+'px' ,'line-height' : size*1.3+'px'});
//  console.log(size);
}
//レスカラー変更
function inputDateColor(color) {
  $(".date").css( { 'color' : color });
}

//ボーダーカラー変更
var dateShadow = '1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333'; //デフォルト値
var dateBdSize = '1';
function inputDateBdColor(color) {
  var s = dateBdSize;
  dateShadow = `${s}px ${s}px 0 ${color}, -${s}px ${s}px 0 ${color}, ${s}px -${s}px 0 ${color}, -${s}px -${s}px 0 ${color}`
  $(".date").css( { 'text-shadow' : dateShadow});
//  $(".res").css( { 'text-stroke' : `${s}px ${color}`}); //text-strokeだと見た目がいまいち
//  text-shadow: 1px 1px 0 #333, -1px 1px 0 #333, 1px -1px 0 #333, -1px -1px 0 #333;

}

//入力完了時にCSS出力
function changeDate() {
  var dateColor = $("#date-color").val();
  var dateSize = $("#date-size").val();
  var dateHeight = Math.ceil(dateSize * 1.3);
  dateCss =
  '' + '\n' +
  '/*レス番号表示部分の設定です*/' + '\n' +
  '.date {' + '\n' +
  '  color:' + dateColor + ';' + '\n' +
  '  font-size:' + dateSize + 'px;' + '\n' +
  '  line-height:' + dateHeight + 'px;' + '\n' +
  '  text-shadow:' + dateShadow + ';' + '\n' +
  '}' + '\n';
  //CSS出力
  outputCSS();
}


//CSS出力
function outputCSS()
{
  //テキストエリアへ反映
  var result = resGeneral + resCss + numCss + nameCss + dateCss;
  //console.log(result);
  $("#outputText").val(result);
}
