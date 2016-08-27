$(document).ready(function () {
    var $tab = $('#tableCategory');

    // $tab.find(".tabline .savebtn").hide();

    $('.data').click(function () {
        var $e = $(this).find('span');

        if(!$e.length){
            return;
        }

        var val = $e.html().trim();
        $(this).html('<input type="text" value="' + val + '" />');
        var $newE = $(this).find('input');
        $(this).prop('contenteditable', true);
        $newE.focus();

        var $row = $(this).parents('tr');
        $row.find(".savebtn").removeClass('hide');

        $newE.on('blur', function () {
            var $cell = $(this).parent();
            $cell.html('<span>' + $(this).val() + '</span>');
            $cell.prop('contenteditable', false);

        });
    });

    $('.savebtn').click(function () {
        var $row = $(this).parents('tr');
        var $saveBtn = $(this);

        var $catId = $row.find("td.catid");
        var catId = $catId.text().trim();
        var data = {
            id: catId,
            name: $row.find("td.catname").text().trim(),
            urlSlug: $row.find("td.catslug").text().trim(),
            description: $row.find("td.catdescr").text().trim()
        };
        $.ajax({
            url: "/categories",
            type: "post",
            data: data
        }).then(function (result) {
            //write new ID into correwsponding cell
            if(!catId) {
                $catId.text(result.category._id);
                $saveBtn.hide();
            }
        }).catch(function(err){
            console.log(err);
        });
    });
    $('.deletebtn').click(function () {
        var $row = $(this).parents('tr');
        var $catId = $row.find(".catid");
        var catId = $catId.text().trim();
        if(catId) {
            var url = "/categories/" + catId;
            $.ajax({
                url: url,
                type: 'delete'
            }).then(function (result) {
                console.log("delete(client) - ok:");
                $row.remove();
            }).catch(function (err) {
                    console.log("delete(client) - error:");
                    console.log(err);
            });
        } else {
            $row.remove();
        }
    });

    $('#add').click(function () {
        var $emptyRow = $tab.find('tr.hide').clone(true).removeClass('hide');
        $emptyRow.prependTo($tab);
    });
});

