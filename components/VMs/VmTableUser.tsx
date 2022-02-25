import { useContext, useLayoutEffect, useMemo, useState } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";
import Table, {
  SelectColumnFilter,
} from "../Admin/Users/Table";
import { API_URL, OS } from "../../config/config";

interface Prop {
  vmsList?: any;
}

export default function VmTable({ vmsList }: Prop) {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (vm) => JSON.stringify([vm.vmName, vm.id]),
        Cell: ({ value }) => {
          value = JSON.parse(value);
          return <Link href={`/dashboard/vms/` + value[1]}>{value[0]}</Link>;
        },
      },

      {
        Header: "Status",
        accessor: "vmState",
      },
      {
        Header: "Period",
        accessor: "period",
      },
      {
        Header: "OS",
        accessor: (e) => e.image.osName,
      },
      {
        Header: "RAM",
        accessor: "memory",
      },
      {
        Header: "Disk",
        accessor: "diskSize",
        Cell: ({ value }) => value + "GB",
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

  if (!vmsList) return <></>;
  return (
    <div className="overflow-auto mx-auto">
      <Table searchable={false} paginated={false} columns={columns} data={vmsList} className=""></Table>
    </div>
  );
}
