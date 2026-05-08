import { useEffect, useState } from 'react';

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import {
  auth,
  provider,
  db
} from './firebase';

const ADMIN_EMAILS = [
  'cksgur7519@naver.com'
];


const wardList = [
  '5A',
  '5C',
  '6A',
  '6C',
  '7W',
  '9W',
  '3ICU',
  '8ICU'
];

const outpatientList = [
  '재활치료실',
  '외래2층',
  '외래4층',
  '채혈실',
  '영상의학과',
  '원무',
  '검진센터',
  '투석실',
  '내시경실'
];

const jobList = [
  '의사',
  '간호사',
  '간호조무사',
  '임상병리사',
  '방사선사',
  '물리치료사'
];

const timeList = [
  '의약품 투여전',
  '진료전',
  '처치전',
  '검사시행 전',
  '외래 접수 시',
  '이송전'
];

const checkMethodList = [
  '환자이름',
  '등록번호',
  '주민등록상 생년월일',
  '신분증',
  '보호자(의사소통X)'
];

const badReasonList = [
  '개방형 미시행',
  '이름만 확인',
  '등록번호만 확인',
  '전부 미시행'
];

function App() {

  const [user,setUser] = useState(null);
  const [isAdmin,setIsAdmin] = useState(false);

  const [locationType,setLocationType] = useState('');
  const [locationDetail,setLocationDetail] = useState('');

  const [job,setJob] = useState('');
  const [time,setTime] = useState('');

  const [methods,setMethods] = useState([]);

  const [result,setResult] = useState('');
  const [badReason,setBadReason] = useState('');

  const [surveyData,setSurveyData] = useState([]);

  useEffect(()=>{

    const unsubscribe = onAuthStateChanged(
      auth,
      async(currentUser)=>{

        setUser(currentUser);

        if(currentUser){

          await setDoc(
            doc(db,'users',currentUser.uid),
            {
              email: currentUser.email
            }
          );

          setIsAdmin(
            ADMIN_EMAILS.includes(currentUser.email)
          );

        }else{
          setIsAdmin(false);
        }

      }
    );

    return ()=>unsubscribe();

  },[]);

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async()=>{

    const snapshot = await getDocs(
      collection(db,'surveys')
    );

    const list = snapshot.docs.map(item=>({
      id: item.id,
      ...item.data()
    }));

    setSurveyData(list);

  };

  const login = async()=>{

    try{

      await signInWithPopup(
        auth,
        provider
      );

    }catch(error){

      console.error(error);

      alert(error.message);

    }

  };

  const logout = async()=>{

    await signOut(auth);

  };

  const toggleMethod = (item)=>{

    if(methods.includes(item)){

      setMethods(
        methods.filter(v=>v !== item)
      );

    }else{

      setMethods([
        ...methods,
        item
      ]);

    }

  };

  const submitSurvey = async()=>{

    if(!locationType || !locationDetail){
      alert('조사 장소를 선택하세요.');
      return;
    }

    if(!job){
      alert('직군을 선택하세요.');
      return;
    }

    if(!time){
      alert('시점을 선택하세요.');
      return;
    }

    if(methods.length < 2){
      alert('확인방법은 2개 이상 선택하세요.');
      return;
    }

    if(!result){
      alert('결과를 선택하세요.');
      return;
    }

    await addDoc(
      collection(db,'surveys'),
      {
        locationType,
        locationDetail,
        job,
        time,
        methods,
        result,
        badReason,
        createdAt: new Date().toISOString()
      }
    );

    alert('저장 완료');

    setLocationType('');
    setLocationDetail('');
    setJob('');
    setTime('');
    setMethods([]);
    setResult('');
    setBadReason('');

    loadData();

  };

  const resetData = async()=>{

    if(!isAdmin){
      alert('관리자만 가능합니다.');
      return;
    }

    const ok = window.confirm(
      '정말 초기화하시겠습니까?'
    );

    if(!ok){
      return;
    }

    const snapshot = await getDocs(
      collection(db,'surveys')
    );

    for(const item of snapshot.docs){

      await deleteDoc(
        doc(db,'surveys',item.id)
      );

    }

    setSurveyData([]);

    alert('초기화 완료');

  };

  const positiveCount = surveyData.filter(
    item=>item.result === '정확'
  ).length;

  const negativeCount = surveyData.filter(
    item=>item.result === '부정확'
  ).length;

  const rate = surveyData.length
    ? Math.round(
        (positiveCount / surveyData.length) * 100
      )
    : 0;

  const chartData = jobList.map(jobItem=>({
    name: jobItem,
    정확: surveyData.filter(
      item=>item.job === jobItem && item.result === '정확'
    ).length,
    부정확: surveyData.filter(
      item=>item.job === jobItem && item.result === '부정확'
    ).length
  }));

  return (

    <div className='container'>

      <div className='topBar'>

        <h1>환자확인 모니터링</h1>

        <div className='topRight'>

          {!user ? (

            <button
              className='primaryBtn'
              onClick={login}
            >
              Google 로그인
            </button>

          ) : (

            <>

              <span>{user.email}</span>

              {isAdmin && (
                <span className='adminBadge'>
                  관리자
                </span>
              )}

              <button
                className='dangerBtn'
                onClick={logout}
              >
                로그아웃
              </button>

            </>

          )}

        </div>

      </div>

      <div className='card'>

        <h2>1. 조사 장소 선택</h2>

        <div className='buttonGrid'>

          <button
            className={
              locationType === '병동'
                ? 'activeBtn'
                : 'normalBtn'
            }
            onClick={()=>{
              setLocationType('병동');
              setLocationDetail('');
            }}
          >
            병동
          </button>

          <button
            className={
              locationType === '외래'
                ? 'activeBtn'
                : 'normalBtn'
            }
            onClick={()=>{
              setLocationType('외래');
              setLocationDetail('');
            }}
          >
            외래
          </button>

        </div>

        {locationType === '병동' && (

          <div className='buttonGrid'>

            {wardList.map(item=>(

              <button
                key={item}
                className={
                  locationDetail === item
                    ? 'activeBtn'
                    : 'normalBtn'
                }
                onClick={()=>{
                  setLocationDetail(item);
                }}
              >
                {item}
              </button>

            ))}

          </div>

        )}

        {locationType === '외래' && (

          <div className='buttonGrid'>

            {outpatientList.map(item=>(

              <button
                key={item}
                className={
                  locationDetail === item
                    ? 'activeBtn'
                    : 'normalBtn'
                }
                onClick={()=>{
                  setLocationDetail(item);
                }}
              >
                {item}
              </button>

            ))}

          </div>

        )}

      </div>

      <div className='card'>

        <h2>2. 직군 선택</h2>

        <div className='buttonGrid'>

          {jobList.map(item=>(

            <button
              key={item}
              className={
                job === item
                  ? 'activeBtn'
                  : 'normalBtn'
              }
              onClick={()=>{
                setJob(item);
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className='card'>

        <h2>3. 시점 선택</h2>

        <div className='buttonGrid'>

          {timeList.map(item=>(

            <button
              key={item}
              className={
                time === item
                  ? 'activeBtn'
                  : 'normalBtn'
              }
              onClick={()=>{
                setTime(item);
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className='card'>

        <h2>4. 확인방법 (2개 이상)</h2>

        <div className='buttonGrid'>

          {checkMethodList.map(item=>(

            <button
              key={item}
              className={
                methods.includes(item)
                  ? 'activeBtn'
                  : 'normalBtn'
              }
              onClick={()=>{
                toggleMethod(item);
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className='card'>

        <h2>5. 결과</h2>

        <div className='buttonGrid'>

          <button
            className={
              result === '정확'
                ? 'activeBtn'
                : 'normalBtn'
            }
            onClick={()=>{
              setResult('정확');
              setBadReason('');
            }}
          >
            정확
          </button>

          <button
            className={
              result === '부정확'
                ? 'dangerBtn'
                : 'normalBtn'
            }
            onClick={()=>{
              setResult('부정확');
            }}
          >
            부정확
          </button>

        </div>

        {result === '부정확' && (

          <div className='buttonGrid'>

            {badReasonList.map(item=>(

              <button
                key={item}
                className={
                  badReason === item
                    ? 'dangerBtn'
                    : 'normalBtn'
                }
                onClick={()=>{
                  setBadReason(item);
                }}
              >
                {item}
              </button>

            ))}

          </div>

        )}

      </div>

      <button
        className='submitBtn'
        onClick={submitSurvey}
      >
        제출
      </button>

      {isAdmin && (

        <button
          className='dangerBtn'
          style={{marginTop:'20px'}}
          onClick={resetData}
        >
          데이터 초기화
        </button>

      )}

     <div className='statsGrid'>

        <div className='statCard'>
          <h3>총 조사</h3>
          <p>{surveyData.length}</p>
        </div>

        <div className='statCard'>
          <h3>정확</h3>
          <p>{positiveCount}</p>
        </div>

        <div className='statCard'>
          <h3>부정확</h3>
          <p>{negativeCount}</p>
        </div>

        <div className='statCard'>
          <h3>정확률</h3>
          <p>{rate}%</p>
        </div>

      </div>

      <div className='chartBox'>

        <h2>직군별 현황</h2>

        <ResponsiveContainer
          width='100%'
          height={300}
        >

          <BarChart data={chartData}>

            <XAxis dataKey='name' />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey='정확'
              fill='#10b981'
            />

            <Bar
              dataKey='부정확'
              fill='#ef4444'
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default App;