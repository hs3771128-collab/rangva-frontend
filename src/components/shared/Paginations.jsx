import { Pagination } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Paginations = ({ numberOfPage, totalProducts }) => {
    const [searchParams] = useSearchParams();
    const pathname = useLocation().pathname;
    const params = new URLSearchParams(searchParams);
    const navigate = useNavigate();
    const paramValue = searchParams.get("page")
                ? Number(searchParams.get("page"))
                : 1;    

    const onChangeHandler = (event, value) => {
        params.set("page", value.toString());
        navigate(`${pathname}?${params}`);
    };

    return(
        <Pagination 
            count={numberOfPage} 
            page={paramValue}   
            defaultPage={1} 
            siblingCount={0} 
            boundaryCount={2} 
            shape="rounded" 
            onChange = {onChangeHandler}
            sx={{
                '& .MuiPaginationItem-root': {
                    color: '#1C1A17',
                    fontSize: 12.5,
                    borderColor: '#E6DCD0',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#1C1A17',
                    color: '#FFFFFF',
                },
                '& .MuiPaginationItem-root.Mui-selected:hover': {
                    backgroundColor: '#C05B45',
                },
            }}
            />
    )
};

export default Paginations;