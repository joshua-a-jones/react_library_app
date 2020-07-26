import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Library extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      library: [],
      newBook: {
        title: '',
        author: '',
        pages: '',
        key: ''
      },
      currentKey: 0
    }

    this.handleInputchange = this.handleInputchange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onBookDelete = this.onBookDelete.bind(this);
    this.onBookEditSubmit = this.onBookEditSubmit.bind(this);
    }

  handleInputchange(event) {
  
    const target = event.target;
    const name = target.name;
    const value = target.value

    let updatedBook = {...this.state.newBook};
    updatedBook[name] = value;

    this.setState({newBook: updatedBook});
  }

  handleSubmit(e) {
    e.preventDefault();


    if (!this.state.newBook.title) {return;}

    let book = Object.assign({}, this.state.newBook);
    let updatedLibrary = this.state.library.concat(book);

    this.setState({library: updatedLibrary});

    this.setState({newBook: {
      title:'',
      author: '',
      pages: '',
      key: this.state.currentKey +1
    }})

    this.setState({currentKey: this.state.currentKey +1})
  }

  onBookDelete(key) {
    
    const index = this.state.library.findIndex((book) =>  book.key === key);
    
    let newLibrary = this.state.library.concat();

    newLibrary.splice(index,1);

    this.setState({library: newLibrary});

  }

  onBookEditSubmit(key, newTitle, newAuthor, newPages) {
    const index = this.state.library.findIndex((book => book.key === key));

    let editedBook = this.state.library[index];
    
    editedBook.title = newTitle;
    editedBook.author = newAuthor;
    editedBook.pages = newPages;

    let newLibrary = this.state.library.concat();

    newLibrary.splice(index,1,editedBook);

    this.setState({library: newLibrary});

  }
  
  render() {
    return (
      <div>
        <form className = {'form'} onSubmit = {this.handleSubmit}>
          <TextInput 
            name = 'title'
            label = 'Book Title' 
            value = {this.state.newBook.title} 
            onInputChange = {this.handleInputchange} 
            placeholder = 'Title' />
          <TextInput 
            label = 'Author:' 
            name = 'author' 
            value = {this.state.newBook.author} 
            placeholder = 'Author'
            onInputChange = {this.handleInputchange} />
          <TextInput 
            label = 'Pages:' 
            name = 'pages' 
            value = {this.state.newBook.pages} 
            placeholder = 'Pages'
            onInputChange = {this.handleInputchange} 
            pattern={"^[0-9]*$"}/>
            <button className = {'submit-button'} type = 'submit'>Add Book</button>
        </form>
        <BookList books = {this.state.library} onDelete = {this.onBookDelete} onBookEditSubmit = {this.onBookEditSubmit}/>
        
      </div>
    )
  }

}


function BookList(props) {
   const bookDivs = props.books.map((book) =>
    <Book 
      book = {book} 
      key = {book.key} 
      handleDelete = {props.onDelete}
      onBookEditSubmit = {props.onBookEditSubmit}
      />
  )   
  return (
    <div>
      <div className = {'book-list-header'}>
        <span>Title</span>
        <span>Author</span>
        <span>Pages</span>
      </div>
      {bookDivs}
    </div>
  )
}


class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'display',
      editFormTitle: '',
      editFormAuthor: '',
      editFormPages: ''

    } 

    this.handleDeleteClicked = this.handleDeleteClicked.bind(this);
    this.handleEditClicked = this.handleEditClicked.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.editFormOnChange = this.editFormOnChange.bind(this);
  }
  
  handleDeleteClicked() {
    this.props.handleDelete(this.props.book.key);
  }

  handleEditClicked() {
    this.setState({status: 'edit'});
  }

  editFormOnChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({[name]: value})
  }

  handleEditSubmit() {

    const title = (this.state.editFormTitle === '') ? this.props.book.title : this.state.editFormTitle;
    const author = (this.state.editFormAuthor === '') ? this.props.book.author : this.state.editFormAuthor;
    const pages = (this.state.editFormPages === '') ? this.props.book.pages : this.state.editFormPages;
    
    this.setState({status: 'display'})
    this.props.onBookEditSubmit(
      this.props.book.key,
       title, 
       author, 
       pages 
       );

       this.setState({editFormTitle: ''});
       this.setState({editFormAuthor: ''});
       this.setState({editFormPages: ''});
  }

  render() { 
    if (this.state.status === 'display') {
      return (
        
          <div className = {'book'}>
              <p>{this.props.book.title}</p>
              <p>{this.props.book.author}</p>
              <p>{this.props.book.pages}</p>
              <button  onClick = {this.handleDeleteClicked} ><i className = "fa fa-trash" /></button>
              <button  onClick = {this.handleEditClicked}><i className = "fa fa-pencil-square-o" /></button>
            </div>
      );
    } else {
      return (
        <div>
          <form className = {'edit-form'} onSubmit = {this.handleEditSubmit}>
            <input 
              type = 'text' 
              name = 'editFormTitle'
              id = 'new-title'
              value = {this.state.editFormTitle}
              placeholder = {this.props.book.title}
              onChange = {this.editFormOnChange}/>
            <input 
              type = 'text'
              name = 'editFormAuthor'
              id = 'new-author'
              value = {this.state.editFormAuthor}
              placeholder = {this.props.book.author}
              onChange = {this.editFormOnChange} />
            <input 
              type = 'text' 
              name = 'editFormPages'
              id = 'new-pages'
              value = {this.state.editFormPages}
              placeholder = {this.props.book.pages}
              onChange = {this.editFormOnChange}/>
            <button 
              type = {'submit'} ><i className ={"fa fa-check-circle"} aria-hidden="true"></i></button>
          </form>
        </div>
      )
    }
  }
}


class TextInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputchange = this.handleInputchange.bind(this);
  }

  handleInputchange(e) {
    this.props.onInputChange(e);
  }

  render() {
    return (
        <div className = {'input-container'}>
          <label htmlFor = {this.props.name}>
            {this.props.label}
          </label>
            <input 
              type = 'text' 
              id = {this.props.name}
              value = {this.props.value}
              name = {this.props.name}
              placeholder = {this.props.placeholder}
              onChange = {this.handleInputchange} />
        </div>
    );
  }
}



class App extends React.Component {

  render() {
    return (
      <div className = {'container'}>
        <h1>My Book List</h1>
        <Library />
      </div>
    )
  }

}



ReactDOM.render(<App />, document.getElementById('root'));