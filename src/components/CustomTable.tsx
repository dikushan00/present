import React from 'react';
import {Table, TableProps} from "antd";
import {ColumnsType} from "antd/es/table";

interface Props extends TableProps<any> {
    mode?: "dark" | "light"
    dataSource: any
    columns: ColumnsType
}

const CustomTable: React.FC<Props> = (props) => {
    return <Table scroll={{x: "auto"}}
                  pagination={false} {...props} size={props.size || "small"}
                  className={props.mode === "dark" ? "dark__table" : "light__table"} />
};

export default CustomTable;
