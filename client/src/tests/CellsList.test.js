import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import CellsList from "../Components/Cells/CellsList";
import { isMainThread } from "worker_threads";

describe("test CellsList component", () => {
  let wrapper;
  let callback;
  beforeEach(() => {
    callback = jest.fn();
    wrapper = shallow(<CellsList onAddCellClick={callback} cells={[]} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("calls props.onAddCellClick when add cell button is clicked", () => {
    const button = wrapper.find(".add-cell-btn");
    button.simulate("click");
    expect(callback.mock.calls.length).toBe(1);
  });
});
