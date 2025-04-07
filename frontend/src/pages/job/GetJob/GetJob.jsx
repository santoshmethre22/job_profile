import React, { useEffect, useState } from 'react'
import { useJob } from '../../../context/Job.context.jsx'


function GetJob() {

    const {getAllJobs}=useJob();

    const [alljobs,setallJobs]=useState("")



        const fetchJob=async()=>{

            const alljobs=await getAllJobs();
            console.log(alljobs)

        }



  return (
    <div>
      

    <h2> hello bhai</h2>

    <button onClick={()=>fetchJob()}> click me </button>

    </div>
  )
}

export default GetJob
