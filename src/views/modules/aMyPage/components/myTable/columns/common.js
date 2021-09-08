/*
 * columnName：数组的唯一标识
 * render:表示函数式组件，供渲染
 * 本文件为通用列，其他文件columnName需带文件名前缀，避免重复
 */
export default function (target) {
    return [
        { columnName: "common_name", prop: "name", label: "姓名", align: "center", width: 120 },
        { columnName: "common_idcode", prop: "sfzh", label: "身份证号", align: "center", width: 180 },
        { columnName: "common_szsw", prop: "szsw", label: "所在单位", align: "center", minWidth: 150 },
        { columnName: "enterPerson", prop: "enterPerson", label: "录入人员", align: "center", width: 120 },
        { columnName: "enterPersonCompany", prop: "enterPersonCompany", label: "录入人员所在单位", align: "center", width: 180 },
        { columnName: "enterTime", prop: "enterTime", label: "录入时间", align: "center", width: 160 },
        {
            columnName: "common_jdxx_cjjg", label: "采集机构", align: "center", prop:'xxcjjg', width: 180,
        },
        {
            columnName: "common_jdxx_jcjg", label: "监察机构", align: "center", width: 180, prop:'jdjg'
        },
        {
            columnName: "manage_state", label: "状态", align: "center", width: 100, render: function (h, context) {
                console.log(context)
                return <span>未审核</span>
            }
        },
        {
            columnName: "control_edit_del",
            prop: "control",
            fixed: "right",
            label: "操作",
            align: "center",
            width: 180,
            render: function (h, context) {
                return (
                    <div>
                        {/* <el-button type="primary" size="small" plain onClick={() => target.editDialog(context.row)}>编辑</el-button>
                        <el-button type="danger" size="small" onClick={() => target.handleDelete(context.row)} plain>删除</el-button> */}
                        <span class='opt-edit' onClick={() => target.editDialog(context.row)}><i class='el-icon-edit'>&#xe621;</i>编辑</span>
                        <span class="opt-del" onClick={() => target.handleDelete(context.row)}><i class='el-icon-delete'>&#xe61c;</i>删除</span>
                    </div>
                );
            }
        },
        {
            columnName: "control_detail",
            prop: "control",
            fixed: "right",
            label: "操作",
            align: "center",
            width: 100,
            render: function (h, context) {
                return (
                    <div>
                        <span class="opt-detail" onClick={() => target.handleDetail(context.row)}><i class='iconfont' style='margin-right:4px;vertical-align: middle;'>&#xe600;</i>查看</span>
                    </div>
                );
            }
        },
        {
            columnName: "control_hx",
            prop: "control",
            fixed: "right",
            label: "操作",
            align: "center",
            width: 100,
            render: function (h, context) {
                return (
                    <div style="background:#e6f2ff;padding:3px 4px;color:#2790ff;border-radius:3px;cursor:pointer" onClick={() => target.handleHx(context.row)}>
                        <span class="opt-detail"><i class='iconfont' style='margin-right:4px;vertical-align: middle;'>&#xe604;</i>画像</span>
                    </div>
                );
            }
        },
        {
            columnName: "control_ck_hx",
            prop: "control",
            fixed: "right",
            label: "操作",
            align: "center",
            width: 200,
            render: function (h, context) {
                if (context.row.flag == 1) {
                    return (
                        <div>
                            <span class="opt-detail" style="margin-right:4px"><i class='iconfont' style='margin-right:4px;vertical-align: middle;' onClick={() => target.handleHx(context.row)}>&#xe604;</i>画像</span>
                            <span class="opt-detail" onClick={() => target.handleDetail(context.row)}><i class='iconfont' style='margin-right:4px;vertical-align: middle;'>&#xe600;</i>查看</span>
                        </div>
                    );
                }
            }
        },

        { columnName: "tz_bcr", prop: "bcrxm", label: "被查人", align: "center", width: 180 },
        { columnName: "tz_bcrsfzh", prop: "bcrsfzh", label: "身份证号", align: "center", width: 180 },
        { columnName: "tz_bcrszdw", prop: "bcrszdw", label: "所在单位", align: "center", minWidth: 180 },
        { columnName: "tz_cxry", prop: "cxry", label: "查询人员", align: "center", width: 180 },
        { columnName: "tz_cxrdw", prop: "cxrdw", label: "查询人单位", align: "center", minWidth: 180 },
        { columnName: "tz_cxsj", prop: "cxsj", label: "查询时间", align: "center", width: 180 },
        {
            columnName: "tz_czlx",
            label: "操作类型",
            align: "center",
            width: 80,
            render: function (h, context) {
                return (<span> {context.row.czlx == 0 ? '查询' :( context.row.czlx == 1 ? "详情" : '画像')}</span> );
            }
        },
        { columnName: "tz_cxts", prop: "cxts", label: "数据条数", align: "center", width: 180 },



        { columnName: "date", prop: "date", label: "日期", align: "center", width: 180 },
        { columnName: "address", prop: "address", label: "地址", minWidth: 180 },
        { columnName: "name", prop: "name", label: "姓名", align: "center", width: 120 },
        { columnName: "user_name", prop: "user_name", label: "姓名", align: "center", width: 120 },
        { columnName: "mem_name", prop: "mem_name", label: "姓名", align: "center", width: 80 },
       
        {
            columnName: "sex_txt", label: "性别", align: "center", width: 80,
            render: function (h, context) {
                let style;
                if (context.row.sex == 1) {
                    style = "color: green";
                } else {
                    style = "color: red";
                }
                return (
                    <span style={style}>{context.row.sex_txt}</span>
                );
            }
        },
        { columnName: "id_code", prop: "id_code", label: "身份证", align: "center", width: 150 },
        { columnName: "iphone", prop: "iphone", label: "电话号码", align: "center", width: 120 },
        { columnName: "remark", prop: "remark", label: "备注" },
        {
            columnName: "control_del",
            fixed: "right",
            prop: "control",
            label: "操作",
            align: "center",
            width: 100,
            render: function (h, context) {
                return (
                    <div>
                        <el-button type='danger' size="small" plain onClick={() => target.handleDelete(context.row)}>删除</el-button>
                    </div>
                );
            }
        },
    ];
}
