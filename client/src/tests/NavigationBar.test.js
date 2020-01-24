import React from "react";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import NavigationBar from "../Components/Shared/NavigationBar";

describe("test NavigationBar component", () => {
  let wrapper;
  let callback;

  beforeEach(() => {
    callback = jest.fn();
    wrapper = shallow(
      <NavigationBar
        awaitingServerResponse={() => {}}
        cells={[]}
        notebookId="123abc"
        deleteAllCells={callback}
        onClearAllResults={callback}
        isClone={false}
        title="test notebook"
        presentation={false}
        // onRemoveCloneFlag={() => {}}
        // onSetNotebookId={() => {}}
        // onSaveClick={() => {}}
        // onCloneClick={() => {}}
        // onRunAllClick={() => {}}
        // onAPISubmit={() => {}}
        // onToggleView={() => {}}
        // onTitleSubmit={() => {}}
        // onHelpClick={() => {}}
      />
    );

    wrapper.setState({
      deleteWarningVisible: false,
      apiModalVisible: false,
      saveOrCloneModalVisible: false,
      webhookModalVisible: false,
      notebookURL: null,
      operation: null,
      titleFormVisible: false
    });
  });

  it("initial state has no forms visible", () => {
    const initialState = {
      deleteWarningVisible: false,
      apiModalVisible: false,
      saveOrCloneModalVisible: false,
      webhookModalVisible: false,
      notebookURL: null,
      operation: null,
      titleFormVisible: false
    };
    expect(wrapper.state()).toEqual(initialState);
  });

  it("state is updated when handleToggleAPIForm is executed", () => {
    wrapper.instance().handleToggleAPIForm();
    expect(wrapper.state().apiModalVisible).toEqual(true);
  });

  it("state is updated when handleToggleSaveOrCloneForm is executed", () => {
    wrapper.instance().handleToggleSaveOrCloneForm();
    expect(wrapper.state().saveOrCloneModalVisible).toEqual(true);
  });

  it("clicking title changes title visibility in state", () => {
    wrapper.instance().handleTitleClick();
    expect(wrapper.state().titleFormVisible).toEqual(true);
  });

  it("executing handleDeleteAllClick calls props.deleteAllCells", () => {
    wrapper.instance().handleDeleteAllClick({ preventDefault: () => {} });
    expect(callback.mock.calls.length).toBe(1);
  });

  it("executing handleClearAllResults calls props.onClearAllResults", () => {
    wrapper.instance().handleClearAllResults({ preventDefault: () => {} });
    expect(callback.mock.calls.length).toBe(1);
  });

  it("clicking Delete option changes deleteWarningVisible to true", () => {
    expect(wrapper.state().deleteWarningVisible).toBe(false);
    wrapper.find(".delete-button-icon").simulate("click");
    expect(wrapper.state().deleteWarningVisible).toBe(true);
  });

  // it("clicking Delete option renders ConfirmAction", () => {
  //   wrapper.find(".delete-button-icon").simulate("click");
  //   expect(wrapper.find(".delete-all-banner").length).toBe(1);
  // });
});

//   describe("handleAddSubmit and handleCancel", () => {
//     beforeEach(() => {
//       wrapper.instance().handleChange({
//         target: {
//           name: "title",
//           value: "Shoe"
//         }
//       });
//       wrapper.instance().handleChange({
//         target: {
//           name: "price",
//           value: "156000000"
//         }
//       });
//       wrapper.instance().handleChange({
//         target: {
//           name: "quantity",
//           value: "5"
//         }
//       });
//     });

//     it("handleCancel resets component state to empty", () => {
//       wrapper.instance().handleCancel();
//       expect(wrapper.state()).toEqual(initialState);
//     });

//     it("props.onSubmit is called when handleAddSubmit is executed", () => {
//       wrapper.instance().handleAddSubmit({ preventDefault: () => {} });
//       expect(callback.mock.calls.length).toBe(1);
//     });

//     it("fields reset to empty after form is submitted", () => {
//       wrapper.instance().handleAddSubmit({ preventDefault: () => {} });
//       expect(wrapper.state()).toEqual(initialState);
//     });

//     it("calls props.onSubmit with product when form is submitted", () => {
//       wrapper.instance().handleAddSubmit({ preventDefault: () => {} });
//       let product = {
//         title: "Shoe",
//         price: "156000000",
//         quantity: "5",
//         formVisible: false
//       };
//       expect(callback.mock.calls[0][0]).toEqual(product);
//     });
//   });
// });
