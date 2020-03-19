function valid_moves(piece, td, team, enemy_pos, ally_pos) {
  var moves = [];

  var all_moves = [];
  var ind = 0;
  for (var i = 11; i <= 88; i++) {
    if((i % 10) < 9 && (i % 10) > 0) all_moves.push(i);
    else ind--;
    ind++;
  }

  /*for(var i = 11; i < 88; i++) {
    console.log(i, enemy_pos[i], ally_pos[i]);
  }*/

  var curr = td.substring(2);

  switch(piece) {
    case "pawn":
      switch(team) {
        case "white":
          for(var i = 0; i < 64; i++) {
            //console.log(curr, all_moves[i], enemy_pos[all_moves[i]], ally_pos[all_moves[i]])
            if(!(enemy_pos[all_moves[i]] || ally_pos[all_moves[i]])) {
              //if(curr == 51) console.log('catch');
              if(all_moves[i] - curr == -10) {
                //console.log(curr, all_moves[i]);
                moves.push(all_moves[i]);
              }
              if(curr >= 71 && curr <= 78 && all_moves[i] - curr == -20) moves.push(all_moves[i]);
            } else if(enemy_pos[all_moves[i]] && (all_moves[i] - curr == -9 || all_moves[i] - curr == -11)) moves.push(all_moves[i]);
          }
          break;
        case "black":
          for(var i = 0; i < 64; i++) {
            if(!(enemy_pos[all_moves[i]] || ally_pos[all_moves[i]])) {
              if(all_moves[i] - curr == 10) moves.push(all_moves[i]);
              if(curr >= 21 && curr <= 28 && all_moves[i] - curr == 20) moves.push(all_moves[i]);
            } else if(enemy_pos[all_moves[i]] && (all_moves[i] - curr == 9 || all_moves[i] - curr == 11)) moves.push(all_moves[i]);
          }
          break;
      }
      break;
    case "knight":
      for(var i = 0; i < 64; i++) {
        if(!ally_pos[all_moves[i]]) {
          if(Math.abs(all_moves[i] - curr) == 8 || Math.abs(all_moves[i] - curr) == 12 || Math.abs(all_moves[i] - curr) == 19 || Math.abs(all_moves[i] - curr) == 21) moves.push(all_moves[i]);
        }
      }
      break;
    case "bishop":
      for(var i = 0; i < 64; i++) {
        if(!ally_pos[all_moves[i]]) {
          if(Math.abs(all_moves[i] - curr) % 11 == 0 && all_moves[i] < curr && all_moves[i] % 10 < curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 11;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 11] || ally_pos[curr - j * 11]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 11 == 0 && all_moves[i] > curr && all_moves[i] % 10 > curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 11;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + (j * 11)] || ally_pos[curr * 1 + j * 11]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 9 == 0 && all_moves[i] < curr && all_moves[i] % 10 > curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 9;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 9] || ally_pos[curr - j * 9]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 9 == 0 && all_moves[i] > curr && all_moves[i] % 10 < curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 9;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + j * 9] || ally_pos[curr * 1 + j * 9]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
        }
      }
      break;
    case "rook":
      for(var i = 0; i < 64; i++) {
        if(!ally_pos[all_moves[i]]) {
          if(Math.abs(all_moves[i] - curr) % 10 == 0 && all_moves[i] < curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 10;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 10] || ally_pos[curr - j * 10]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 10 == 0 && all_moves[i] > curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 10;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + (j * 10)] || ally_pos[curr * 1 + j * 10]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(all_moves[i].toString().substring(0, 1) == curr.substring(0, 1) && all_moves[i] < curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr);
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j] || ally_pos[curr - j]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(all_moves[i].toString().substring(0, 1) == curr.substring(0, 1) && all_moves[i] > curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr);
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + j] || ally_pos[curr * 1 + j]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
        }
      }
      break;
    case "queen":
      //Copy-paste bishop and rook
      for(var i = 0; i < 64; i++) {
        if(!ally_pos[all_moves[i]]) {
          if(Math.abs(all_moves[i] - curr) % 11 == 0 && all_moves[i] < curr && all_moves[i] % 10 < curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 11;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 11] || ally_pos[curr - j * 11]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 11 == 0 && all_moves[i] > curr && all_moves[i] % 10 > curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 11;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + (j * 11)] || ally_pos[curr * 1 + j * 11]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 9 == 0 && all_moves[i] < curr && all_moves[i] % 10 > curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 9;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 9] || ally_pos[curr - j * 9]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 9 == 0 && all_moves[i] > curr && all_moves[i] % 10 < curr % 10) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 9;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + j * 9] || ally_pos[curr * 1 + j * 9]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 10 == 0 && all_moves[i] < curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 10;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j * 10] || ally_pos[curr - j * 10]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(Math.abs(all_moves[i] - curr) % 10 == 0 && all_moves[i] > curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr) / 10;
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + (j * 10)] || ally_pos[curr * 1 + j * 10]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(all_moves[i].toString().substring(0, 1) == curr.substring(0, 1) && all_moves[i] < curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr);
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr - j] || ally_pos[curr - j]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
          if(all_moves[i].toString().substring(0, 1) == curr.substring(0, 1) && all_moves[i] > curr) {
            var is_blocked = false;
            var num_check = Math.abs(all_moves[i] - curr);
            for(var j = 1; j < num_check; j++) {
              if(enemy_pos[curr * 1 + j] || ally_pos[curr * 1 + j]) is_blocked = true;
            }
            if(!is_blocked) moves.push(all_moves[i]);
          }
        }
      }
      break;
    case "king":
      for(var i = 0; i < 64; i++) {
        if(!ally_pos[all_moves[i]]) {
          if(Math.abs(all_moves[i] - curr) == 1 || Math.abs(all_moves[i] - curr) == 11 || Math.abs(all_moves[i] - curr) == 9 || Math.abs(all_moves[i] - curr) == 10) moves.push(all_moves[i]);
          switch(team) {
            case "white":
              if(curr == 85 && document.getElementById("wking_moved").value == 0) {
                if(document.getElementById("wrookk_moved").value == 0 && !ally_pos[86] && !enemy_pos[86] && !ally_pos[87] && !enemy_pos[87]) moves.push(87);
                if(document.getElementById("wrookq_moved").value == 0 && !ally_pos[84] && !enemy_pos[84] && !ally_pos[83] && !enemy_pos[83]) moves.push(83);
              }
              break;
            case "black":
              if(curr == 15 && document.getElementById("bking_moved").value == 0) {
                if(document.getElementById("brookk_moved").value == 0 && !ally_pos[16] && !enemy_pos[16] && !ally_pos[17] && !enemy_pos[17]) moves.push(17);
                if(document.getElementById("brookq_moved").value == 0 && !ally_pos[14] && !enemy_pos[14] && !ally_pos[13] && !enemy_pos[13]) moves.push(13);
              }
              break;
          }
        }
      }
      break;
  }


  /*var temp = 0;
  while(moves[temp] != null) {
    console.log(moves[temp]);
    temp++;
  }*/
  return moves;
}

function valid_highlight(piece, td, team, enemy_pos, ally_pos) {
  highlights = valid_moves(piece, td, team, enemy_pos, ally_pos);
  if(piece == "pawn") {
    switch(team) {
      case "white":
        var corner = td.substring(2) - 9;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) - 11;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) - 10;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) - 20;
        if((corner % 10) < 9 && (corner % 10) > 0 && td.substring(2) >= 71 && td.substring(2) <= 78) highlights.push(corner);
        break;
      case "black":
        var corner = td.substring(2) * 1 + 9;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) * 1 + 11;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) * 1 + 10;
        if((corner % 10) < 9 && (corner % 10) > 0) highlights.push(corner);
        corner = td.substring(2) * 1 + 20;
        if((corner % 10) < 9 && (corner % 10) > 0 && td.substring(2) >= 21 && td.substring(2) <= 28) highlights.push(corner);
        break;
    }
  }
  //console.log(piece, td, highlights);
  return highlights;
}
