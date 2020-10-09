var Moduleindex = (function () {

    var _apiclient =  null;


    function  setName(){
        var name = $("#class_search").val();
        localStorage.setItem("name",name);
    }

    function _selectteachingclasses(data){
        var $select = $("#teaching_classes").selectpicker();
        for (var i = 0; i < data.length; i++) {
            var o = new Option(data[i].nombre,data[i].id);
            $(o).html(data.nombre);
            $select.append(o);
        }
        $(".selectpicker").selectpicker("refresh");
    }

    function _selectstudyingclasses(data){
        var $select = $("#studying_classes").selectpicker();
        for (var i = 0; i < data.length; i++) {
            var o = new Option(data[i].nombre,data[i].id);
            $(o).html(data.nombre);
            $select.append(o);
        }
        $(".selectpicker").selectpicker("refresh");
    }

    function getTeachingClasses(){
        $("#studying_classes").on("change",function(){
            $(this).find("option:selected").each(function(){
                localStorage.setItem("studying_class_id",$(this).attr("value"));
                window.location.href="selectclass.html";
            });
        });
        var email = localStorage.getItem("username");
        var token = localStorage.getItem("Authorization");
        _apiclient.getTeachingClasses(email,_selectteachingclasses,token);
    }

    function getStudyingClasses(){
        var email = localStorage.getItem("username");
        var token = localStorage.getItem("Authorization");
        _apiclient.getStudyingClasses(email,_selectstudyingclasses,token);
    }




    return {
        setName:setName,
        getStudyingClasses:getStudyingClasses,
        getTeachingClasses:getTeachingClasses,
    };
})();