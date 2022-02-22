﻿'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EPoles = function () {
    function EPoles() {
        _classCallCheck(this, EPoles);
        this.dtList = $('#gv_poleslist');
        this.order = [[1, "desc"]];//<'domInput'>
        this.dom = "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-8'<'domInput dataTables_filter'>>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
        this.searching = false;
        this.search = $('#searchForm');
        this.btnSearch = $('#btn_search');
    }
    /*
        l - length changing input control
        f - filtering input
        r - processing display element
        t - The table!
        i - Table information summary
        p - pagination control
     */
    _createClass(EPoles, [{
        key: 'init',
        value: function init() {
            var me = this;

            this.btnSearch.click(function () {

                me.dt.ajax.reload(function (json) {

                });
            });

            this.createDatatable();
        }
    },
    {
        key: 'createDatatable',
        value: function createDatatable() {

            var me = this;
            this.dt = this.dtList.DataTable({
                "dom": me.dom,
                "pageLength": 20,
                "processing": true, // for show progress bar
                "serverSide": true, // process server side
                "filter": true, // this is for disable filter (search box)
                //"order": me.order,
                //"orderMulti": false, // for disable multiple column at once    
                "searching": false,
                "ajax": {
                    "url": me.getUrl,
                    "type": "POST",
                    "contentType": 'application/json',
                    "data": function data(_data) {
                        var formValues = FormSerialize.getFormArray(me.search, _data);
                        return JSON.stringify(formValues);
                    }
                },
                "columnDefs": [{
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }],
                "columns": [
                    { "data": "id", "name": "Id", "autoWidth": true },
                    { "data": "fullName", "name": "Name", "autoWidth": true },
                    { "data": "latitude", "name": "Latitude", "autoWidth": true },
                    { "data": "longitude", "name": "Longitude", "autoWidth": true },
                    { "data": "area", "name": "Area", "autoWidth": true },
                    { "data": "street", "name": "Street", "autoWidth": true },
                    { "data": "description", "name": "Description", "autoWidth": true },
                    { "data": "note", "name": "Note", "autoWidth": true },
                    {
                        className: "text-center",
                        "data": "status",
                        "render": function (data, row) {
                            if (data) {
                                return '<div class="badge badge-success">ใช้งาน</div>';
                            }
                            else {
                                return '<div class="badge badge-danger">เสีย</div>';
                            }
                        }
                    },
                    {
                        className: "text-center",
                        "data": "id",
                        "orderable": false,
                        "render": function (data, row) {
                            if (data) {
                                return '<a href="#" title="ลบ" class="border-0 btn-transition btn btn-outline-danger del"><i class="fa fa-trash-alt"></i></a>';
                            }
                            else {
                                return '<a title="ลบ" class="border-0 btn-transition btn btn-outline-danger del"><i class="fa fa-trash-alt"></i></a>';
                            }
                        }
                    }
                ],
                "initComplete": function (settings, json) {
                    $("div.domInput").html($(".searchArea").removeAttr("hidden"));
                }
            });

            this.dt.on('click', 'a.del', function (e) {
                var objDt = me.dt.row($(this).closest('tr')).data();
                var obj = {};
                obj["Id"] = objDt.id;
                obj["Name"] = objDt.name;
                obj["Latitude"] = objDt.latitude;
                obj["Longitude"] = objDt.longitude;
                obj["Area"] = objDt.area;
                obj["Street"] = objDt.street;
                obj["Note"] = objDt.note;
                obj["Description"] = objDt.description;
                obj["Status"] = objDt.status;
                obj["UserId"] = me.userId.toString();
                confirmDelete("คุณต้องการที่จะลบข้อมูลนี้หรือไม่?", function (event) {
                    if (event) {
                        $.ajax({
                            type: 'POST',
                            url: me.delUrl,
                            data: JSON.stringify(obj),
                            dataType: 'JSON',
                            contentType: "application/json",
                            success: function success(result) {
                                successMsgAlert("ลบข้อมูลนี้สำเร็จ");
                                setTimeout(function () { window.location.href = me.indexUrl }, 1000);
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                warningMsgAlert(thrownError);
                            }
                        });
                    }
                });

            });
        }
    },
    ]);


    return EPoles;
}();