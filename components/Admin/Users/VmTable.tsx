import { useContext, useLayoutEffect, useMemo, useState } from "react";
import AuthContext from "../../../context/authContext";
import Link from "next/link";
import Table, {
  SelectColumnFilter,
} from "../../../components/Admin/Users/Table";
import { API_URL, OS } from "../../../config/config";

export default function VmTable({vmsList}) {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "vmName",
      },

      {
        Header: "Status",
        accessor: "vmState",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Period",
        accessor: "period",
      },
      {
        Header: "OS",
        accessor: "os",
        Cell: ({ value }) => <div>{OS[value]}</div>,
      },
      {
        Header: "RAM",
        accessor: "memory",
      },
      {
        Header: "CPU#",
        accessor: "processorCores",
      },
      {
        Header: "Paid",
        accessor: (e) => (e.isPaid ? "YES" : "NO"),
      },
      {
        Header: "Created",
        accessor: "createDateTime",
        Cell: ({ value }) => {
          const dateTime = new Date(value);
          const x = dateTime.toLocaleString().split(",");

          return (
            <div className="">
              <div>{x[0]}</div>
              <div>{x[1]}</div>
            </div>
          );
        },
      },
      {
        Header: "Expire Date",
        accessor: "endPriodDateTime",
        Cell: ({ value }) => {
          const dateTime = new Date(value);
          console.log(dateTime.getTime(), Date.now());
          const deltaT = (
            (dateTime.getTime() - Date.now()) /
            86400000
          ).toFixed();
          const x = dateTime.toLocaleString().split(",");

          return (
            <div className="">
              <div>{x[0]}</div>
              <div>{x[1]}</div>
              <div>{deltaT} days left </div>
            </div>
          );
        },
      },
    ],
    []
  );
  
  return (
    <div className="overflow-auto mx-auto">
      
      <Table columns={columns} data={vmsList} className=""></Table>
    </div>
  );
}
