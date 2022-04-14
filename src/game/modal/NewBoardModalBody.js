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
        <button onClick={() => props.handleResetBoard(null, 8, 5, true)}>
          New board (easy, pure random)
        </button>
        <button onClick={() => props.handleResetBoard(null, 12, 7, true)}>
          New board (medium, pure random)
        </button>
        <button onClick={() => props.handleResetBoard(null, 17, 8, true)}>
          New board (hard, pure random)
        </button>
      </div>
      <div>
        <button onClick={props.backModal}>Go Back</button>
      </div>
    </div>
  );
};

export default NewBoardModalBody;
