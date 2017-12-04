 
//В первом там надо написать свой месачь бокс с мэппингом стилей на CSS-класс по типу сообщения, 
//во втором – построить диалоговую панель на базе бокса используя агрегацию компонентов, 
//в третьей сделать опросник, показывающий список вопросов. 
//По каждому вопросу есть линк “Показать ответ”, он должен вываливать диалог, разработанный в первых задачах и при акцепте скрывать диалог и отображать ответ, иначе возвращаться к исходному состоянию. 
//Кнопка “Показать ответ” должна запрещаться, если ответ уже один раз выбрали показазывать.

//1 TASK ----------------------------
//If should not render any markup return null


let React = require('react');

const mapClass = new Map(
 [['success', 'alert-success'], ['message', 'alert-info'], ['caution', 'alert-warning'], ['error', 'alert-danger']]
)

// TODO: Create the Notification Component
const Notification = props => {  

 if (!props.notification)
   return null
 
 const {notification: {message, type}} = props
 if (!message)
   return null
 const msgClass = mapClass.get(type) || 'alert-info'
   
 return (
      <div className={`alert ${msgClass}`}>{message}</div>
 )
}

function App(props) {
   // TODO: Pass Notification its props
               return (
                              <div id="app">
                                              <Notification {...props} />
                              </div>
               )
}


//2 TASK ----------------------------
//Strange, that we need to modify the first component

let React = require('react');

const mapClass = new Map(
 [['success', 'alert-success'], ['message', 'alert-info'], ['caution', 'alert-warning'], ['error', 'alert-danger']]
)

// TODO: Create the Notification Component
const Notification = props => {  

 if (!props.notification)
   return null
 
 const {notification: {message, type}, children} = props
 if (!message)
   return null
 const msgClass = mapClass.get(type) || 'alert-info'
   
 return (
    <div className={`alert ${msgClass}`}>
     <p>{message}</p>
     {children}
   </div>
 )
}

// TODO: Create a Confirmation Component
class Confirmation extends React.Component {    
   constructor(props) {
       super(props)
       this.state = {submitted: 0}
   }
 
 handleOk = e => {
   if (this.state.submitted)
     return
   this.props.accept && this.props.accept()    
   this.setState( (p, s) => ({submitted: 1}) )
 } 
 handleCancel = e => {
   if (this.state.submitted)
     return
   this.props.decline && this.props.decline()    
   this.setState( (p, s) => ({submitted: 2}) )
 }
 
 getResult = _ => (this.state.submitted)
 
 render() {
   const {message, type, accept, decline} = this.props
   
   if (this.state.submitted)
     return null
   
   return (      
       <Notification notification={{message, type}}>
         <div className="btn btn-primary" onClick={this.handleOk}>Sure</div>
         <div className="btn btn-danger" onClick={this.handleCancel}>No Thanks</div>
       </Notification>      
   )
 }
}


//3 TASK ------------------------------------------

let React = require('react');

const mapClass = new Map(
 [['success', 'alert-success'], ['message', 'alert-info'], ['caution', 'alert-warning'], ['error', 'alert-danger']]
)

// TODO: Create the Notification Component
const Notification = props => {  

 if (!props.notification)
   return null
 
 const {notification: {message, type}, children} = props
 if (!message)
   return null
 const msgClass = mapClass.get(type) || 'alert-info'
   
 return (
    <div className={`alert ${msgClass}`}>
     <p>{message}</p>
     {children}
   </div>
 )
}

// TODO: Create a Confirmation Component
class Confirmation extends React.Component {    
   constructor(props) {
       super(props)
       this.state = {submitted: 0}
   }
 
 handleOk = e => {
   e.preventDefault()
   if (this.state.submitted)
     return
   this.props.accept && this.props.accept()    
   this.setState( (p, s) => ({submitted: 1}) )
 } 
 handleCancel = e => {
   e.preventDefault()
   if (this.state.submitted)
     return
   this.props.decline && this.props.decline()    
   this.setState( (p, s) => ({submitted: 2}) )
 }
 
 getResult = _ => (this.state.submitted)
 
 render() {
   const {message, type, accept, decline} = this.props
   
   if (this.state.submitted)
     return null
   
   return (      
       <Notification notification={{message, type}}>
         <div className="btn btn-primary" onClick={this.handleOk}>Sure</div>
         <div className="btn btn-danger" onClick={this.handleCancel}>No Thanks</div>
       </Notification>      
   )
 }
}

class QuestionContainer extends React.Component { 
 state = {phase: 0}
 //0 - initial: confirmation has not opened, show answer btn enabled, answer not shown
 //1 - answer is shown
 //2 - answer accepted, answer is shown

 handleShowAnswer = e => {
   e.preventDefault()
   if (this.state.phase > 1)
     return    
   this.setState( (p, s) => ({phase: 1}) )
 }

 handleConfirmation = confirmed => _ => {
   this.setState( (p, s) => ({phase: confirmed ? 2:0}) )
 }

 render() {
   const {question, answer} = this.props
   const {phase} = this.state
   
   return (
     <div className="container">
       {phase === 1 && 
         <Confirmation message='Reveal the answer?' accept={this.handleConfirmation(true)} decline={this.handleConfirmation(false)} />}
       <p className="question">{question}</p>
       <div className="btn btn-primary show-answer" onClick={this.handleShowAnswer} disabled={phase === 2} >Show Answer</div>
       {phase === 2 && <p className="answer">{answer}</p>}
     </div>
   )
 }
}

class QuestionList extends React.Component { 
 render() {
   const {questions} = this.props
   if (!questions)
     return null

   return (
     <div>
       {questions.map((item, i) => <QuestionContainer key={i} {...item} />)} 
     </div>
   )
 }
}
