const NewBoardModalBody = (props) => {
  return (
    <div>
      <div>
        <button onClick={() => props.handleResetBoard(null, 8, 5)}>
          New board (easy)
        </button>
        <button onClick={() => props.handleResetBoard(null, 12, 7)}>
          New board (medium)
        </button>
        <button onClick={() => props.handleResetBoard(null, 17, 8)}>
          New board (hard)
        </button>
      </div>
      <div>
        <button onClick={() => props.handleResetBoard(null, 8, 5, "simple")}>
          New board (easy, pure random)
        </button>
        <button onClick={() => props.handleResetBoard(null, 12, 7, "simple")}>
          New board (medium, pure random)
        </button>
        <button onClick={() => props.handleResetBoard(null, 17, 8, "simple")}>
          New board (hard, pure random)
        </button>
      </div>
      <div>
        <button onClick={props.backModal}>Back to Settings</button>
      </div>
    </div>
  );
};

export default NewBoardModalBody;
