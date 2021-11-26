export default function PathNode(props) {
  if (props.node && props.node.length > 0) {
    let nodeClass = "";

    props.node.forEach((dir, index) => {
      if (index === 0) nodeClass = "game-path-";
      nodeClass = nodeClass.concat(dir);
    });

    return <span className={`game-path ${nodeClass} game-path-anim-fadeout`} />;
  }

  return null;
}
