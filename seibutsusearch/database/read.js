let database = [];
let gairai = {};
let type = {};

const files = {
  "biodic": [
    "biodic/03_chorui.csv",
    "biodic/04_honyurui.csv",
    "biodic/04_kairui.csv",
    "biodic/04_konchurui_cho.csv",
    "biodic/04_konchurui_ga.csv",
    "biodic/04_konchurui_kochu.csv",
    "biodic/04_konchurui_semi.csv",
    "biodic/04_konchurui_tonbo.csv",
    "biodic/04_ryoseiruihachurui.csv",
    "biodic/04_tansuigyorui.csv",
    "biodic/05_honyurui.csv",
    "biodic/05_kairui.csv",
    "biodic/05_konchurui_cho.csv",
    "biodic/05_konchurui_ga.csv",
    "biodic/05_konchurui_kochu.csv",
    "biodic/05_konchurui_semi.csv",
    "biodic/05_konchurui_tonbo.csv",
    "biodic/05_ryoseiruihachurui.csv",
    "biodic/05_tansuigyorui.csv"
  ],
  "biodic02":[
    "biodic/02_chorui_1.csv",
    "biodic/02_chorui_2.csv",
    "biodic/02_honyurui.csv",
    "biodic/02_konchurui.csv",
  ],
  "biodic06":[
    "biodic/06_honyurui.csv"
  ],
  "gairai":[
    "gairai.csv"
  ],
  "type": [
    "type.csv"
  ]
}
for(let type of Object.keys(files)){
  for(let fileName of files[type]){
    fetch(`https://funa1wa2wa.github.io/seibutsusearch/database/${fileName}`)
    .then(res=>res.text())
    .then(text=>{
      let ary = CSVtoAry(text);
      switch(type){
        case "biodic":
          database.push(...ary.map(x=>({
            name : x[4],
            meshcode : x[5],
            date : x[6],
            year : Number("19"+x[6].slice(0, 2))
          })));
          break;
        case "biodic02":
          database.push(...ary.map(x=>({
            name : x[4],
            meshcode : x[0],
            date : "78--",
            year : 1978
          })));
          break;
        case "biodic06":
          database.push(...ary.map(x=>({
            name : x[0],
            meshcode : x[1].slice(0, 6),
            date : "04--",
            year : 2004
          })));
          break;
        case "gairai":
          ary.map(x=>{
            gairai[x[4]] = {
              origin: x[0],
              specify: x[2],
              remark: x[10]=="*"?"":x[10],
              distribution: x[11]
            }
          });
          break;
        case "type":
          ary.map(x=>{
            type[x[0]] = x[1]
          });
          break;
      }
    });
  }
}

// CSV形式のString -> 2次元配列
function CSVtoAry(str){
  return str.replaceAll("\"", "").split(/\r?\n/).map(x=>x.split(",")).filter(x=>x.length>1);
}
