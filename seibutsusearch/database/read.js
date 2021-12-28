let database = [];
let creature = {};
let cityToMesh = {};

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
}

for(let type of Object.keys(files)){
  for(let fileName of files[type]){
    fetch(`https://funa1wa2wa.github.io/seibutsusearch/database/${fileName}`)
    .then(res=>res.text())
    .then(text=>{
      if(type!="mesh"){
        let ary = CSVtoAry(text);
        switch(type){
          case "biodic":
            for(let x of ary){
              database[x[5]] = database[x[5]] || [];
              database[x[5]].push({
                name : x[4],
                year : Number("19"+x[6].slice(0, 2))
              })
            }
            break;
          case "biodic02":
            for(let x of ary){
              database[x[0]] = database[x[0]] || [];
              database[x[0]].push({
                name : x[4],
                year : 1978
              })
            }
            break;
          case "biodic06":
            for(let x of ary){
              database[x[1].slice(0, 6)] = database[x[1].slice(0, 6)] || [];
              database[x[1].slice(0, 6)].push({
                name : x[0],
                year : 2004
              })
            }
            break;
          case "gairai":
            for(let x of ary){
              creature[x[4]] = creature[x[4]] || {};
              Object.assign(creature[x[4]], {
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
        }
      }else{
        cityToMesh = JSON.parse(text);
      }
    });
  }
}

// CSV形式のString -> 2次元配列
function CSVtoAry(str){
  return str.replaceAll("\"", "").split(/\r?\n/).map(x=>x.split(",")).filter(x=>x.length>1);
}
