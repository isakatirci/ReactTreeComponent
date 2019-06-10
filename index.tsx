import {
  ITrxBaseHandles,
  ITrxBaseProps,
  TrxBaseFormHOC
} from "@zt/base-components";
import { AutoComplete, Input, Tree } from "antd";
import { SelectValue } from "antd/lib/select";
import React, { forwardRef, useEffect, useState } from "react";

const { TreeNode } = Tree;
const Search = Input.Search;

type myNode = {
  children: myNode[];
  key: string;
  title: string;
  parent?: myNode;
};

const dataList: myNode[] = [];

const x = 3;
const y = 2;
const z = 1;

const myNode1: myNode = {
  key: "key1",
  title: "title1",
  children: []
};
const myNode2: myNode = {
  key: "key2",
  title: "title2",
  children: [],
  parent: myNode1
};
const myNode3: myNode = {
  key: "key3",
  title: "title3",
  children: [],
  parent: myNode2
};

myNode1.children!.push(myNode2, myNode3);

const gData: myNode[] = [myNode1];

const generateList = (data: myNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    dataList.push({ ...node, children: [...node.children!] });
    if (node.children.length !== 0) {
      generateList(node.children);
    }
  }
};

export interface MyCompLProps extends ITrxBaseProps {}

const MyCompL: React.RefForwardingComponent<ITrxBaseHandles, MyCompLProps> = (
  props,
  ref
) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string[]>([]);

  useEffect(() => {
    generateList(gData);
  }, []);

  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onSelect = (value: SelectValue, option: Object) => {
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value.toString()) > -1) {
          if (item.parent) {
            return item.parent.key;
          }
          return "";
        }
        return "";
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value.toString());
  };

  const loop = (data: myNode[]) =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "#f50" }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children.length != 0) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });

  const handleSearch = (value: string) => {
    setDataSource(
      dataList
        .map(item => item.title)
        .filter(item => item.toUpperCase().indexOf(value.toUpperCase()) !== -1)
    );
  };

  return (
    <div>
      <AutoComplete
        dataSource={dataSource}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="input here"
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {loop(gData)}
      </Tree>
    </div>
  );
};

export default TrxBaseFormHOC(forwardRef(MyCompL));
