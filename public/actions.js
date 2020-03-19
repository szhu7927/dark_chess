//server data
function move(data) {
  var from = document.getElementById(data.from);
  var to = document.getElementById(data.to);

  //console.log(data.from, data.to);
  //console.log(from, to);
  $(to).append(from.children[0]);

  //Capture piece
  if(to.children.length > 1) {
    console.log("capture");
    to.children[0].remove();
  }

  //Promote pawn if on last rank
  if(data.promote) {
    promote(data.team, data.to);
  }

  //Castle info
  if(data.piece == "king") {
    switch(data.team) {
      case "white":
        //Update if white
        if(document.getElementById("player") == 1) {
          document.getElementById("wking_moved").value = "1";
          if(data.from == "td85" && data.to == "td87" && document.getElementById("wrookk_moved").value == 0) {
            //console.log($(document.getElementById("td88").children)[0]);
            $(document.getElementById("td86")).append($(document.getElementById("td88").children[0]));
            //console.log("white castled");
          } else if(data.from == "td85" && data.to == "td83" && document.getElementById("wrookk_moved").value == 0) {
            $(document.getElementById("td84")).append($(document.getElementById("td81").children[0]));
          }
        } else {
          //Update if black
          if(data.from == "td85" && data.to == "td87") {
            $(document.getElementById("td86")).append($(document.getElementById("td88").children[0]));
          } else if(data.from == "td85" && data.to == "td83") {
            $(document.getElementById("td84")).append($(document.getElementById("td81").children[0]));
          }
        }
        break;
      case "black":
        if(document.getElementById("player") == 2) {
          document.getElementById("bking_moved").value = "1";
          if(data.from == "td15" && data.to == "td17" && document.getElementById("brookk_moved").value == 0) {
            $(document.getElementById("td16")).append($(document.getElementById("td18").children[0]));
          } else if(data.from == "td15" && data.to == "td13" && document.getElementById("brookk_moved").value == 0) {
            $(document.getElementById("td14")).append($(document.getElementById("td11").children[0]));
          }
        } else {
          if(data.from == "td15" && data.to == "td17") {
            $(document.getElementById("td16")).append($(document.getElementById("td18").children[0]));
          } else if(data.from == "td15" && data.to == "td13") {
            $(document.getElementById("td14")).append($(document.getElementById("td11").children[0]));
          }
        }
        break;
    }
  }

  if(data.piece == "rook") {
    if(document.getElementById("player") == 1) {
      if(data.from == "td88") document.getElementById("wrookk_moved").value = "1";
      else if(data.from == "td81") document.getElementById("wrookq_moved").value = "1";
    }
    else if(document.getElementById("player") == 2) {
      if(data.from == "td18") document.getElementById("wrookk_moved").value = "1";
      else if(data.from == "td11") document.getElementById("wrookq_moved").value = "1";
    }
  }

  //Update all visibility for opposing player
  if(document.getElementById("player").value == 1) var team = "white";
  else var team = "black";
  if(data.team != team) {
    enemy_pos = data.ally_pos;
    ally_pos = data.enemy_pos;
    update_vision("", team, data.from, data.to, enemy_pos, ally_pos);
  }

  //Update all visibility for current player
  if(data.promote) var piece = "queen";
  else var piece = data.piece;
  if(data.team == team) {
    for(var i = 11; i <= 88; i++) {
      if(orig_colors[i] != null) {
        $(document.getElementById("td".concat(i))).css("background-color", orig_colors[i]);
      }
    }
    update_vision(piece, data.team, data.from, data.to, data.enemy_pos, data.ally_pos);
  }

  //Update player's turn
  if(data.team == "white") {
    console.log('white moved')
    document.getElementById("turn").value = "Black's turn to move";
    if(document.getElementById("player").value == 1) $(document.getElementById("w_board")).css("border-color", "#53b0a2");
    else $(document.getElementById("b_board")).css("border-color", "#53b0a2");
  } else {
    document.getElementById("turn").value = "White's turn to move";
    if(document.getElementById("player").value == 2) $(document.getElementById("b_board")).css("border-color", "#b07dab");
    else $(document.getElementById("w_board")).css("border-color", "#b07dab");
  }

  //Update opponent piece visibility
  show_new_piece();
}

var orig_colors;

$(document).ready(function() {
  //Create original colors array
  orig_colors = [];
  for(var i = 11; i <= 88; i++) {
    if((i % 10) < 9 && (i % 10) > 0) {
      var curr_td = $(document.getElementById("td".concat(i)));
      orig_colors[i] = curr_td.css("background-color");
    }
  }

  if(document.getElementById("player").value == 1) {
    for(var i = 11; i <= 48; i++) {
      if((i % 10) < 9 && (i % 10) > 0) {
        $(document.getElementById("td".concat(i))).css("background-color", "#111");
        $(document.getElementById("td".concat(i)).children[0]).hide();
      }
    }
  } else {
    for(var i = 51; i <= 88; i++) {
      if((i % 10) < 9 && (i % 10) > 0) {
        $(document.getElementById("td".concat(i))).css("background-color", "#111");
        $(document.getElementById("td".concat(i)).children[0]).hide();
      }
    }
  }
});

$(function() {

  var from_td;
  var td;
  var piece;
  var team;

  var ally_pos;
  var enemy_pos;
  var moves;

  var possible_moves_arr;
  var highlight_arr;

  $(".draggable").draggable( {
    revert: 'invalid',
    revertDuration: 0,
    //create: function() {$(this).data('position',$(this).position())},
    cursor:'move',
    start: function(event, ui) {
      from_td = $(this).parent().attr("id");

      //Get possible moves based on piece type
      piece = $(this).attr("type");
      team = $(this).attr("team");
      enemy_pos = [];
      ally_pos = [];

      for(var i = 11; i <= 88; i++) {
        if(document.getElementById("td".concat(i)) != null && document.getElementById("td".concat(i)).children.length > 0) {
          var temp_team = $(document.getElementById("td".concat(i)).children[0]).attr("team");
          if(temp_team == team) ally_pos[i] = true;
          else if(temp_team != null) enemy_pos[i] = true;
        }
      }

      moves = valid_moves(piece, from_td, team, enemy_pos, ally_pos);
      possible_moves_arr = [];
      console.log(piece);

      //Highlight squares based on type of piece
      var ind = 0;
      while(moves[ind] != null) {
        var curr_td = $(document.getElementById("td".concat(moves[ind])));
        possible_moves_arr[moves[ind]] = curr_td.css("background-color");
        curr_td.css("background-color", "#777");
        ind++;
      }
    }
  });

  $(".droppable").droppable({
    drop: function(event, ui) {
      //Prevent moving twice in a row
      if((document.getElementById("turn").value == "Black's turn to move" && team == "white") || (document.getElementById("turn").value == "White's turn to move" && team == "black")) {
        //Revert move highlights
        for(var i = 11; i <= 88; i++) {
          if(possible_moves_arr[i] != null) {
            $(document.getElementById("td".concat(i))).css("background-color", possible_moves_arr[i]);
          }
        }
        ui.draggable.draggable( 'option', 'revert', true );
        return;
      }

      //Prevent same team collisions
      if(event.target.children.length > 0 && $(ui.draggable[0]).attr("team") == $(event.target.children[0]).attr("team")) {
        console.log("collision");
        //Revert move highlights
        for(var i = 11; i <= 88; i++) {
          if(possible_moves_arr[i] != null) {
            $(document.getElementById("td".concat(i))).css("background-color", possible_moves_arr[i]);
          }
        }
        ui.draggable.draggable( 'option', 'revert', true );
        return;
      }

      //Get piece type, start and end location of piece
      td = $(this).attr("id");
      console.log(from_td, td);

      //Prevent invalid moves
      //console.log(orig_colors[td.substring(2)]);
      var ind1 = 0;
      var is_valid = false;
      while(moves[ind1] != null) {
        if(td.substring(2) == moves[ind1]) {
          is_valid = true;
          break;
        }
        ind1++;
      }
      if(!is_valid) {
        //Revert move highlights
        for(var i = 11; i <= 88; i++) {
          if(possible_moves_arr[i] != null) {
            $(document.getElementById("td".concat(i))).css("background-color", possible_moves_arr[i]);
          }
        }
        ui.draggable.draggable( 'option', 'revert', true );
        return;
      }

      /*
      //Change HTML
      var from = document.getElementById(from_td);
      var to = document.getElementById(td);
      //$(to).append(from.children[0]);
      //$(from_td).append(ui.draggable);
      */

      //snapToMiddle(ui.draggable,$(this));

      //Reset all movement
      ui.draggable.draggable( 'option', 'revert', true );

      //Update positions, pieces
      ally_pos[td.substring(2)] = true;
      ally_pos[from_td.substring(2)] = null;

      //Return boolean whether pawn should promote
      var promote = is_promote_ready(piece, team, td);

      //Send server data
      var data = {
        from: from_td,
        to: td,
        piece: piece,
        team: team,
        enemy_pos: enemy_pos,
        ally_pos: ally_pos,
        promote: promote
      }
      socket.emit('move', data);
    },
  });
});

function update_vision(piece, team, from_td, td, enemy_pos, ally_pos) {
  //Create highlighted array
  //console.log(enemy_pos);
  var highlight_arr = [];
  for(var i = 11; i <= 88; i++) {
    if((i % 10) < 9 && (i % 10) > 0 && ((ally_pos[i] && i != from_td.substring(2)) || i == td.substring(2))) {
      var temp_piece = $(document.getElementById("td".concat(i)).children[0]).attr("type");
      var temp_team = $(document.getElementById("td".concat(i)).children[0]).attr("team");

      if(i == td.substring(2)) {
        temp_piece = piece;
        temp_team = team;
      }

      /*if(piece == "") {
        enemy_pos[from_td] = null;
        enemy_pos[td] = true;
        console.log('true');
      }*/

      var highlights = valid_highlight(temp_piece, "td".concat(i), temp_team, enemy_pos, ally_pos);

      //console.log(temp_piece, "td".concat(i), temp_team, highlights);

      var ind2 = 0;
      while(highlights[ind2] != null) {
        //console.log(i, temp_piece, highlights[ind2]);
        highlight_arr[highlights[ind2]] = true;
        ind2++;
      }
      highlight_arr[i] = true;
    }
  }
  console.log("next");

  //Highlight hidden tiles, hide images
  for(var i = 11; i <= 88; i++) {
    if((i % 10) < 9 && (i % 10) > 0) {
      if(highlight_arr[i] == null) {
        var curr_td = $(document.getElementById("td".concat(i)));
        $(document.getElementById("td".concat(i)).children[0]).hide();
        curr_td.css("background-color", "#111");
      } else {
        $(document.getElementById("td".concat(i)).children[0]).show();
      }
    }
  }
  return highlight_arr;
}

function show_new_piece() {
  for(var i = 11; i <= 88; i++) {
    if((i % 10) < 9 && (i % 10) > 0) {
      var hidden = $(document.getElementById("td".concat(i))).css("background-color") == "rgb(17, 17, 17)";
      if(!hidden) {
        $(document.getElementById("td".concat(i)).children[0]).show();
      }
      else $(document.getElementById("td".concat(i)).children[0]).hide();
    }
  }
}

function is_promote_ready(piece, team, td) {
  if(piece == "pawn") {
    switch(team) {
      case "white":
        //console.log("promote", td);
        if(td.substring(2) >= 11 && td.substring(2) <= 18) {
          console.log("Promote!");
          return true;
        }
    }
  }
}

function promote(team, td) {
  //console.log("PROMOTE", $(document.getElementById(td).children[0]).attr("type"));
  $(document.getElementById(td).children[0]).attr("type", "queen");
  switch(team) {
    case "white":
      $(document.getElementById(td).children[0]).attr("src", "wqueen.png");
      break;
    case "black":
      $(document.getElementById(td).children[0]).attr("src", "bqueen.png");
      break;
  }
}

/*
function snapToMiddle(dragger, target){
  var offset = target.offset();
  var topMove = (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
  var leftMove= (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
  dragger.offset({ top: topMove + offset.top, left: leftMove + offset.left })
}
*/
