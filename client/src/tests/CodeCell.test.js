import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import CodeCell from "../Components/Cells/CodeCell";
import { isMainThread } from "worker_threads";

describe("test CodeCell component", () => {
  let wrapper;
  let callback;
  beforeEach(() => {
    const rubyCell = { code: "puts hi", id: "123abc", language: "Ruby"}
    callback = jest.fn();
    wrapper = shallow(<CodeCell cell={rubyCell} code={''} onAddClick={callback} onDeleteClick={callback} onLanguageChange={callback} toggleRender={callback} onUpdateCodeState={callback} onRunClick={callback} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("cell state receives cell code from props", () => {
    expect(wrapper.state().code).toEqual("puts hi");
  });
});
