import s from "./style.module.css"

const Loader = () => {
  return (
    <>
        <div className={s.main}>
            <i className={s.loader}></i>
        </div>
    </>
  );
};

export default Loader;
