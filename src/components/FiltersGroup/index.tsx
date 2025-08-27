import './index.css'

interface shelf{
    value:string,
    label:string
}
interface props{
    isActive: boolean,
    shelf: shelf,
    changeCategory: (value: string) => void
}
const FiltersGroup = (props:props) => {
    const {shelf,changeCategory,isActive} = props
    const {value, label} = shelf
    const onClickLabel = () => {
        changeCategory(value)

    }
      const pClass = isActive ? 'active-tab-btn' : 'tab-btn'

    return(
        <li className='list-item'>
         
         <p className={pClass} onClick={onClickLabel}>{label}</p> 
        </li>
    )
        
        
        

    
    
}
export default FiltersGroup