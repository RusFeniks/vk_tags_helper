var Temp_TagList = [];
var Temp_ClickList = [];
var Temp_ObjectList = [];
var copyed = "";

function tag_input() {
    var border = $('#border').val();
    var spacer = $('#spacer').val();
    var link = $('#link').val();
    var nav1 = $('#nav1').val();
    var nav2 = $('#nav2').val();
    var tags_nav = "";
    var tags_ser = "";
    $('.tag').each(function(index, el) {
      
      if($(this).val() != "" & $(this).val() != "　　") {

        $(this).val($(this).val().replace(/ |-/gi, "_"));

        if($(this).hasClass('nav')) {

          if(tags_nav != "") {
            tags_nav += spacer + "#" + $(this).val() + link;
          } else {
            tags_nav += "#" + $(this).val() + link;
          }

        } else {

          if(tags_ser != "") {
            tags_ser += spacer + "#" + $(this).val();
          } else {
            tags_ser += "#" + $(this).val();
          }

        }
      }
    });
    var line = "";
    var i = 0;
    if(tags_nav.length > 45) {
      i = 47;
    } else {
      i = tags_nav.length + 2;
    }
    for (var n = i; n >= 0; n--) {
      line += border;
    }
    $('#result1').text("\n" + line + "\n" + nav1 + tags_nav + nav2 + "\n" + tags_ser);
    //$('#result2').text("\n" + nav1 + tags_nav + nav2 + "\n" + tags_ser);
}

function Create_Massives() {
  if(localStorage.getItem('Tag_list') != null) {
    Temp_ObjectList = JSON.parse(localStorage.getItem('Tag_list'));
  } else {
    Temp_ObjectList = [];
  }

  Temp_ObjectList.forEach( function(element, index) {
    Temp_TagList[index] = element.Tag;
    Temp_ClickList[index] = element.Uses;
  });
}

function Draw_Tags() {
  result = "<span style='font-size: 1.1em; border: 1px solid #000; margin-right: 15px;' onclick='addedTag($(this))'>&#12288;&#12288;</span>";
  Temp_ObjectList.forEach( function(element, index) {
    size = 1 + (element.Uses / 100 * 1.1);
    result += "<span style='font-size: "+ size +"em' onclick='addedTag($(this))'>"+element.Tag+"</span>";
  });
  $('#best-tags').html(result);
}

function addedTag(object) {
  var Tag_value = object.text();
  $('.tag').each(function(index, el) {
    if($(this).val() == "") {
      $(this).val(Tag_value);
      Tag_value = "";
      tag_input();
    }
  });
}

function save_setting(key,val) {
  localStorage.setItem(key, val);
}

function clear_all() {
  $('.tag').each(function(index, el) {
    $(this).val("");
    tag_input();
  });
}

$( document ).ready(function() {

   $('#border').val(localStorage.getItem('#border'));
   $('#spacer').val(localStorage.getItem('#spacer'));
   $('#link').val(localStorage.getItem('#link'));
   $('#nav1').val(localStorage.getItem('#nav1'));
   $('#nav2').val(localStorage.getItem('#nav2'));

  tag_input();
  Create_Massives();
  Draw_Tags();

	$('.result').focus(function(event) {
    if($(this).val() != "") {
  		$(this).select();
  		document.execCommand('copy');

      if($(this).val() != copyed) {
      copyed = $(this).val();

      Create_Massives();

      $('.tag').each(function(index, el) {
        if($(this).val() != "" & $(this).val() != "　　"){
          if(Temp_TagList.indexOf($(this).val()) == -1) {
            Temp_TagList.push($(this).val());
            Temp_ClickList.push(1);
          } else {
            var i = Temp_TagList.indexOf($(this).val());
            Temp_ClickList[i] += 1;
          }
        }
      });

      for(i = 0; i<Temp_ObjectList.length; i++) {
        for(j = 0; j<Temp_ObjectList.length; j++) {
          if(Temp_ClickList[i] > Temp_ClickList[j]) {
            Temp_Click = Temp_ClickList[i];
            Temp_Tag = Temp_TagList[i];
            Temp_ClickList[i] = Temp_ClickList[j];
            Temp_TagList[i] = Temp_TagList[j];
            Temp_ClickList[j] = Temp_Click;
            Temp_TagList[j] = Temp_Tag;
          }
        }
      }

      Temp_ObjectList = [];
      for(i = 0; i < Temp_TagList.length; i++) {
        Temp_ObjectList.push({Tag: Temp_TagList[i],Uses: Temp_ClickList[i]});
      }

      localStorage.setItem('Tag_list', JSON.stringify(Temp_ObjectList));

      Draw_Tags();
  }}
	});

	$('.tag').on('keyup input', function() {
  		tag_input();
	});

  $('#link').on('keyup input', function() {
      tag_input();
      save_setting('#link',$(this).val())
  });

  $('#spacer').on('keyup input', function() {
      tag_input();
      save_setting('#spacer',$(this).val());
  });

  $('#border').on('keyup input', function() {
      tag_input();
      save_setting('#border',$(this).val());
  });

  $('#nav1').on('keyup input', function() {
      tag_input();
      save_setting('#nav1',$(this).val());
  });

  $('#nav2').on('keyup input', function() {
      tag_input();
      save_setting('#nav2',$(this).val());
  });

});