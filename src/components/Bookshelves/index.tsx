import {useEffect , useState} from "react"
import Cookies from "js-cookie"
import './index.css'
import {TailSpin} from 'react-loader-spinner'
import Header from "../Header"
import BookCard from "../BookCard"
import FiltersGroup from "../FiltersGroup"
import Contact from "../Contact"
import type { BookdetailsData } from "../types"
interface Bookshelf{
    id: string | number
    value: string
    label:string
}

interface ApiResponse{
    status:string,
    data:BookdetailsData[]|null,
    errorMsg:string|null
}
interface ApiBook{
    author_name: string;
    cover_pic: string;
    id: number;
    rating: string;
    read_status: string;
    title: string;

}

interface BookshelvesProps {
    bookshelvesList: Bookshelf[]
}
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
}

const Bookshelves = (props:BookshelvesProps) => {
    const [apiResponse, setApiResponse] = useState<ApiResponse>({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg: null
    })
    const {bookshelvesList} = props
    console.log(bookshelvesList)
    
    
    const [bookShelfName, setBookShelfName] = useState('ALL')
    const [searchText, setSearchText] = useState('')
    const [searchInput, setSearchInput] = useState('')


    // const [activeCategoryId, setActiveCategoryId] = useState('')
    // const [input,setInput] = useState('')
    const onChangeSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value)
    }
    const onSearchKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    setSearchText(searchInput.toLowerCase()) 
  }
}

    useEffect(()=>{
        const getResponse = async () =>{
            setApiResponse({
                    status: apiStatusConstants.inProgress,
                    data: null,
                    errorMsg: null,
                })
            const jwtToken = Cookies.get('jwt_token')
            console.log(jwtToken)
            const url=`https://apis.ccbp.in/book-hub/books?shelf=${bookShelfName}&search=${searchText.toLowerCase()}`
            // console.log(url)
            const options = {
                headers:{
                    Authorization: `Bearer ${jwtToken}`
                },
                method: 'GET'
            };
            const response = await fetch(url,options)
            console.log(response)
            if(response.ok==true){
                const fetchedData = await response.json()
                // console.log(fetchedData)
                const formattedData = fetchedData.books.map((each:ApiBook)=>({
                    authorName: each.author_name,
                    coverPic: each.cover_pic,
                    id: each.id,
                    rating: each.rating,
                    readStatus: each.read_status,
                    title: each.title
                }))
                console.log(formattedData)
                setApiResponse(prev=>({
                    ...prev,
                    data: formattedData,
                    status:apiStatusConstants.success
                }))
                setSearchInput('')

                
            }
            else{
                setApiResponse(prev=>({
                  ...prev,
                  status: apiStatusConstants.failure  
                }))
            }

        }
        getResponse()
    },[bookShelfName,searchText])
    const renderBooksListView = () => {
        const {data} = apiResponse
        
        return (!data || data.length === 0)?(
            <div>
                <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752370266/Asset_1_1_palt0z.png" className="search-no"/>
                <p className="search-no-para">Your search for {searchText} did not find any matches.</p>
            </div>
        ):
        (<div className="bookshelves-cont">
                
                <div className="top-div">
                    <h1 className="main-head">All Books</h1>
                    <div className="search-div">
                    <input placeholder="search" className="search-input" onChange={onChangeSearch} value={searchInput} onKeyDown={onSearchKeyDown}></input>
                    <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752385848/magnifying-glass-icon-isolated-on-white-background-search-illustration-vector_odwkjt.jpg" className="search-img"/>
                    </div>
                </div>
                <ul  className="bookshelves-grid">
                   {data.map((each) => (
                    <BookCard books={{ ...each, readStatus: each.readStatus === 'READ' }} key={each.id}/>
                   ))}
                </ul>
            </div>
        )
    }
    const renderLoadingView = ():React.ReactElement => {
        return(
            <div className="load">
            
            <div className="loader-container" data-testid="loader">
                <TailSpin height={50} width={50} color="#0284C7" />
            </div>
            </div>)

    }
    const renderFailureView = () :React.ReactElement => {
        return(
        <div>
            <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752372175/Group_7522_iwvq1j.png" className="went-wrong-img"/>
            <h1 className="went-wrong-head">Something went wrong, Please try again.</h1>
            <button className="went-wrong-button">Try Again</button>
        </div>)
    }
    const renderAllBooks = ()  => {
        const {status} = apiResponse
        switch(status){
            case apiStatusConstants.success:
                return renderBooksListView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            default:
                return null
            
        }
    }
    const changeCategory = (value:string) => {
        setBookShelfName(value)
    }
    
    return(
        
            
            <div className="book-shelves-cont">
                <div>
                <Header/>
                </div>
                <div className="flexing">
                <div className="side-cont">
                    <h1 className='heading'>Bookshelves</h1>
                {bookshelvesList.map((each)=>(

                <FiltersGroup 
                        key={each.id}
                        shelf={each}
                        changeCategory={changeCategory}
                        isActive = {each.value==bookShelfName}
                        
                />
                ))}
                
                </div>
                <div className="render-book-cont">
                    {renderAllBooks()} 
            
                </div>
                
           
            </div>
            <div className="con">
            <Contact/>
            </div>
        </div>
    )


}
export default Bookshelves