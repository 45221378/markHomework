let changeReplace = function (str) {
  if (str) {
    var replaceStr = str.toString();
    const regclose = new RegExp('</cloze>', 'gi');
    const regBlank = new RegExp('<blank/>', 'gi');
    const reglongfill = new RegExp('<longfill/>', 'gi');
    const reglongFill = new RegExp('<longFill/>', 'gi');
    const reglongFillClose = new RegExp('<longfill> </longfill>', 'gi');
    const regfill = new RegExp('<fill/>', 'gi');
    const regclass = new RegExp('class =', 'gi');
    const pointEndone = new RegExp('</point1>', 'gi');
    const pointEndtwo = new RegExp('</point2>', 'gi');
    const tdEnd = new RegExp('</td>', 'gi');
    const table = new RegExp('</tab>', 'gi');
    const regbrack = new RegExp('<brack>.*?</brack>', 'gi');
    //当td里面的style 里面的width 小于12，则去掉width属性
    
    if (replaceStr.indexOf('<blank/>') >= 0) {
      replaceStr = replaceStr.replace(regBlank, '')
    }
    if (replaceStr.indexOf('<fill>') >= 0) {
      replaceStr = replaceStr.replace(/<fill>/g, '<span>_____</span>')
    }
    if (replaceStr.indexOf('<longFill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongFill, '<span>______________</span>')
    }
    if (replaceStr.indexOf('<longfill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongfill, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(reglongFillClose, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<fill/>') >= 0) {
      replaceStr = replaceStr.replace(regfill, '')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(/<longfill>/g, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(/<longfill>/g, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<cloze>') >= 0) {
      let num = replaceStr.split('<cloze>');
      for (var i = 1; i <= num.length; i++) {
        replaceStr = replaceStr.replace(/<cloze>/, `<span style="border-bottom:1px solid #333;padding:0 10px;display:inline-block;text-indent:0;">`)
      }
    }
    if (replaceStr.indexOf('</cloze>') >= 0) {
      replaceStr = replaceStr.replace(regclose, `</span>`)
    }
    if (replaceStr.indexOf('<brack>') >= 0) {
      replaceStr = replaceStr.replace(regbrack, `<span class="brack"></span>`)
    }
    if (replaceStr.indexOf('class =') >= 0) {
      replaceStr = replaceStr.replace(regclass, 'class=')
    }
    if (replaceStr.indexOf('<point2>') >= 0) {
      replaceStr = replaceStr.replace(/<point2>/g, '<span class="point1">')
    }
    if (replaceStr.indexOf('<point1>') >= 0) {
      replaceStr = replaceStr.replace(/<point1>/g, '<span class="point1">')
    }
    if (replaceStr.indexOf('<tab>') >= 0) {
      replaceStr = replaceStr.replace(/<tab>/g, '<span class="textIndent-tab">')
    }
    if (replaceStr.indexOf('</tab>') >= 0) {
      replaceStr = replaceStr.replace(table, '</span>')
    }
    if (replaceStr.indexOf('</point1>') >= 0) {
      replaceStr = replaceStr.replace(pointEndone, '</span>')
    }
    if (replaceStr.indexOf('</point2>') >= 0) {
      replaceStr = replaceStr.replace(pointEndtwo, '</span>')
    }
    if (replaceStr.indexOf('</td>') >= 0) {
      replaceStr = replaceStr.replace(tdEnd, '&nbsp;</td>')
    }
    return replaceStr
  }
}

let changeReplaceNo = function (str) {
  if (str) {
    var replaceStr = str.toString();
    const regclose = new RegExp('<cloze>.*?</cloze>');
    const regBlank = new RegExp('<blank/>', 'gi');
    const reglongfill = new RegExp('<longfill/>', 'gi');
    const reglongFill = new RegExp('<longFill/>', 'gi');
    const reglongFillClose = new RegExp('<longfill> </longfill>', 'gi');
    const regfill = new RegExp('<fill/>', 'gi');
    const regclass = new RegExp('class =', 'gi');
    const pointEndone = new RegExp('</point1>', 'gi');
    const pointEndtwo = new RegExp('</point2>', 'gi');
    const tdEnd = new RegExp('</td>', 'gi');
    const table = new RegExp('</tab>', 'gi');
    const regbrack = new RegExp('<brack>.*?</brack>', 'gi');

    if (replaceStr.indexOf('<blank/>') >= 0) {
      replaceStr = replaceStr.replace(regBlank, '')
    }
    if (replaceStr.indexOf('<fill>') >= 0) {
      replaceStr = replaceStr.replace(/<fill>/g, '<span>_____</span>')
    }
    if (replaceStr.indexOf('<longFill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongFill, '<span>______________</span>')
    }
    if (replaceStr.indexOf('<longfill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongfill, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(reglongFillClose, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<fill/>') >= 0) {
      replaceStr = replaceStr.replace(regfill, '')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(/<longfill>/g, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(/<longfill>/g, '<span>_______________</span>')
    }
    if (replaceStr.indexOf('<cloze>') >= 0) {
      let num = replaceStr.split('<cloze>');
      for (var i = 1; i <= num.length; i++) {
        replaceStr = replaceStr.replace(regclose, `<span style="border-bottom:1px solid #333;padding:0 10px;display:inline-block;text-indent:0;">( ${i} )</span>`)
      }
    }
    if (replaceStr.indexOf('<brack>') >= 0) {
      replaceStr = replaceStr.replace(regbrack, `<span class="brack"></span>`)
    }
    if (replaceStr.indexOf('class =') >= 0) {
      replaceStr = replaceStr.replace(regclass, 'class=')
    }
    if (replaceStr.indexOf('<point2>') >= 0) {
      replaceStr = replaceStr.replace(/<point2>/g, '<span class="point1">')
    }
    if (replaceStr.indexOf('<point1>') >= 0) {
      replaceStr = replaceStr.replace(/<point1>/g, '<span class="point1">')
    }
    if (replaceStr.indexOf('<tab>') >= 0) {
      replaceStr = replaceStr.replace(/<tab>/g, '<span class="textIndent-tab">')
    }
    if (replaceStr.indexOf('</tab>') >= 0) {
      replaceStr = replaceStr.replace(table, '</span>')
    }
    if (replaceStr.indexOf('</point1>') >= 0) {
      replaceStr = replaceStr.replace(pointEndone, '</span>')
    }
    if (replaceStr.indexOf('</point2>') >= 0) {
      replaceStr = replaceStr.replace(pointEndtwo, '</span>')
    }
    if (replaceStr.indexOf('</td>') >= 0) {
      replaceStr = replaceStr.replace(tdEnd, '&nbsp;</td>')
    }
    return replaceStr
  }
}

let formatSeconds = function (value) {

  var theTime = parseInt(value);// 秒
  var middle = 0;// 分

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
  }
  var result = parseInt(theTime) > 9 ? parseInt(theTime) : '0' + parseInt(theTime);
  if (middle > 9) {
    result = parseInt(middle) + ":" + result;
  } else {
    result = '0' + parseInt(middle) + ":" + result;
  }

  return result;
}

module.exports = {
  changeReplace: changeReplace,
  changeReplaceNo: changeReplaceNo,
  formatSeconds: formatSeconds,
}