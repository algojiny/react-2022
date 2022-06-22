import logo from './logo.svg';
import './App.css';
import {useState} from 'react'; //훅 = 리엑트에서 제공하는 기본적인 함수

function Header(props){
  return(
    <header>
      <h1><a href='/' onClick={(e)=>{
        e.preventDefault(); 
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}

function Nav(props){
  const lis = []
  for(let i=0; i < props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={e=>{
        e.preventDefault();
        props.onChangeMode(+e.target.id);//id는 최소에 숫자였지만 태그의 속성으로{}안에 들어가면서 문자열 id가 되어서 Number()나 +로 다시 값을 숫자로 변환 시켜줌
      }}>{t.title}</a></li>);
  }
  return(
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}

function Article(props){
  return(
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props){
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={e=>{
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title'/></p>
        <p><textarea name='body' placeholder='body'></textarea></p>
        <p><input type='submit' value='Create'/></p>
      </form>
    </article>
  )
}

function Update(props){
  const [title, setTitle] = useState(props.title);//props는 읽기전용이므로 수정하기 위해서는 state로 변환
  const [body, setbody] = useState(props.body);
  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={e=>{
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title' value={title} onChange={e=>{ //리엑트에서는 입력1회마다 onChange함수 호출됨
          setTitle(e.target.value); //각입력시 입력값으로 state변경시킴
        }}/></p>  
        <p><textarea name='body' placeholder='body' value={body} onChange={e=>{
          setbody(e.target.value);
        }}></textarea></p>
        <p><input type='submit' value='Update'/></p>
      </form>
    </article>
  )
}

function App() {
 /*  const _mode = useState('WELCOME');//useState의 인자'WELCOME'은 useState의 초기값,useState는 배열을 리턴하는데 그 배열의 0번째 원소는 상태의 값을 읽을 때, 1번째 원소는 그 상태의 값을 변경할때 사용하는 함수
  const mode = _mode[0]//mode의 상태값 읽기
  const setMode = _mode[1]//mode의 상태(state)값 변경할때 사용하는 함수 */
  const [mode, setMode] = useState('WELCOME'); //위의 세줄의 의미를 축약시킨 문법
  const [id, setId] = useState(null);//useState의 초기값이 없는 상태로 세팅 = null
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title='Welcome' body='Hello, WEB'></Article>
  }else if(mode === 'READ'){
    let title, body = null; //초기화
    for(let i = 0; i < topics.length; i++){
     if(topics[i].id === id){
      title = topics[i].title;
      body = topics[i].body;
     }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = 
    <>
      <li><a href={'/update'+id} onClick={e=>{
        e.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type='button' value='Delete' onClick={()=>{
        //button은 기본 동작이 따로 없기 때문에, e.preventDefault()를 추가하지 않아도 됨
        const newTopics = [];
        for(let i = 0; i < topics.length; i++){
          if(topics[i].id !== id){
           newTopics.push(topics[i]);
          }
         }
         setTopics(newTopics);
         setMode('WELCOME');
      }}/></li>
    </>//READ모드일때만 update링크가 나타나기, 리엑트에서 태그를 다룰때는 하나의 태그 안에 들어 있어야 하기 때문에 병렬로 태그를 추가하기 위해서는 겉에 빈 태그로 감싸준다.
  }else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id: nextId, title: _title, body: _body}//사용자가 form에 입력한 내용을 새 topic항목으로 만듬
      const newTopics = [...topics] //오리지날topics는 건들지 않기 위해 복제
      newTopics.push(newTopic); //복제한 topics에 새 topic을 추가함
      setTopics(newTopics); // 새 topic이 추가된 복제본 topics로 state로 변경
      setMode('READ');
      setId(nextId); //read모드로 바뀌면서 지금 추가한 내용을 보여주기위해
      setNextId(nextId+1);
    }}></Create>
  }else if(mode === 'UPDATE'){
    let title, body = null; //초기화
    for(let i = 0; i < topics.length; i++){
     if(topics[i].id === id){
      title = topics[i].title;
      body = topics[i].body;
     }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log(title, body);
      const updatedTopic = {id:id, title:title, body:body}
      const newTopics = [...topics]
      for(let i=0; i<newTopics.length;i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title='WEB' onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href='/create' onClick={e=>{
            e.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;

