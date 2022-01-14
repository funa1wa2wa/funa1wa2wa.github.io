const PLACE_NAME = ["河川上流", "河川中流", "河川下流(汽水域含む)", "湖", "農業用水", "池沼", "水田", "マングローブ", "畑", "森林", "草原", "住宅地", "高山", "牧場", "砂地", "その他"];
const TYPE_LIST = ["哺乳類", "貝類", "淡水魚類", "両生類・爬虫類", "昆虫類", "鳥類", "植物"];

let database = [];
let creature = {};
let cityToMesh = {};
let usage = [];

const files = {
  "biodic": [
    "biodic/do03_chorui.csv",
    "biodic/do04_honyurui.csv",
    "biodic/do04_kairui.csv",
    "biodic/do04_konchurui_cho.csv",
    "biodic/do04_konchurui_ga.csv",
    "biodic/do04_konchurui_kochu.csv",
    "biodic/do04_konchurui_semi.csv",
    "biodic/do04_konchurui_tonbo.csv",
    "biodic/do04_ryoseiruihachurui.csv",
    "biodic/do04_tansuigyorui.csv",
    "biodic/do05_honyurui.csv",
    "biodic/do05_kairui.csv",
    "biodic/do05_konchurui_cho.csv",
    "biodic/do05_konchurui_ga.csv",
    "biodic/do05_konchurui_kochu.csv",
    "biodic/do05_konchurui_semi.csv",
    "biodic/do05_konchurui_tonbo.csv",
    "biodic/do05_ryoseiruihachurui.csv",
    "biodic/do05_tansuigyorui.csv"
  ],
  "biodic02":[
    "biodic/do02_chorui_1.csv",
    "biodic/do02_chorui_2.csv",
    "biodic/do02_honyurui.csv",
    "biodic/do02_konchurui.csv",
  ],
  "biodic06":[
    "biodic/do06_honyurui.csv"
  ],
  "gairai":[
    "gairai.csv"
  ],
  "type": [
    "type.csv"
  ],
  "mesh": [
    "2meshcodes.json"
  ],
  "area": [
    "area/gyorui_area.csv",
    "area/chorui_area.csv"
  ],
  "gakumei": [
    "gakumei.csv"
  ],
  "ksj": [
    "ksj.csv"
  ],
  "ksnkankyo": [
    "ksnkankyo/dam/dam_hokkaido.csv",
    "ksnkankyo/dam/dam_tohoku1.csv",
    "ksnkankyo/dam/dam_tohoku2.csv",
    "ksnkankyo/dam/dam_kanto.csv",
    "ksnkankyo/dam/dam_hokuriku.csv",
    "ksnkankyo/dam/dam_chubu.csv",
    "ksnkankyo/dam/dam_kinki.csv",
    "ksnkankyo/dam/dam_chugoku.csv",
    "ksnkankyo/dam/dam_shikoku.csv",
    "ksnkankyo/dam/dam_kyushu.csv",
    "ksnkankyo/dam/dam_okinawa.csv"
  ],
  "cityLevel":[
    "cityLevel.csv"
  ]
}

fetch("https://funa1wa2wa.github.io/seibutsusearch/database/fixName")
.then(res=>res.text())
.then(text=>{
  let fix = {};
  for (let i of CSVtoAry(text)){
    fix[i[0]] = i[1];
  }
  let fixName = name=>{
    if(name in fix)return fix[name];
    return name;
  }
for(let type of Object.keys(files)){
  for(let fileName of files[type]){
    fetch(`https://funa1wa2wa.github.io/seibutsusearch/database/${fileName}`)
    .then(res=>res.text())
    .then(text=>{
      if(type!="mesh"){
        const ary = CSVtoAry(text);
        switch(type){
          case "biodic":
            for(let x of ary){
              database[x[5]] = database[x[5]] || [];
              database[x[5]].push({
                name : fixName(x[4]),
                year : Number("19"+x[6].slice(0, 2))
              })
            }
            break;
          case "biodic02":
            for(let x of ary){
              database[x[0]] = database[x[0]] || [];
              database[x[0]].push({
                name : fixName(x[4]),
                year : 1978
              })
            }
            break;
          case "biodic06":
            for(let x of ary){
              database[x[1].slice(0, 6)] = database[x[1].slice(0, 6)] || [];
              database[x[1].slice(0, 6)].push({
                name : fixName(x[0]),
                year : 2004
              })
            }
            break;
          case "gairai":
            for(let x of ary){
              creature[x[4]] = creature[x[4]] || {};
              Object.assign(creature[x[4]], {
                alien: true,
                origin: x[0],
                specify: x[2],
                remark: x[10]=="*"?"":x[10],
                distribution: x[11]
              });
            }
            break;
          case "type":
            for(let x of ary){
              creature[x[1]] = creature[x[1]] || {};
              creature[x[1]].type = x[0];
            }
            break;
          case "area":
            for(let x of ary){
              creature[x[0]] = creature[x[0]] || {};
              creature[x[0]].place = Object.fromEntries(x.slice(1).map((x,i)=>[PLACE_NAME[i], x==1]));
            }
            break;
          case "gakumei":
            for(let x of ary){
              creature[x[1]] = creature[x[1]] || {};
              creature[x[1]].scientific  = x[0];
            }
            break;
          case "ksj":
            for(let x of ary){
              usage[x[0]] = usage[x[0]] || [];
              usage[x[0]][x[1]] = usage[x[0]][x[1]] || [];
              usage[x[0]][x[1]][x[2]] = x[3];
            }
            break;
          case "ksnkankyo":
            for(let x of ary){
              database[x[0]] = database[x[0]] || [];
              database[x[0]].push({
                year : x[1],
                name : fixName(x[2])
              })
            }
            break;
          case "cityLevel":
            for(let x of ary){
              database[x[0]] = database[x[0]] || [];
              database[x[0]].push({
                year : x[1],
                name : fixName(x[2])
              })
            }
            break;
        }
      }else{
        cityToMesh = JSON.parse(text);
      }
    });
  }
}
});



// CSV形式のString -> 2次元配列
function CSVtoAry(str){
  return str.replaceAll("\"", "").split(/\r?\n/).map(x=>x.split(",")).filter(x=>x.length>1);
}
