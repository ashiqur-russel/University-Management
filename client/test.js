const adminRoutes = [
    {
        name:'Dashboard',
      path: "dashboard",
      element: "<AdminDashboard />",
    },
    {
        name:'User Management',
        children:[
            {
                name:'Create Student',
                path: "create-student",
                element: "<CreateStudent />",
              },
              {
                name:'Create Faculty',
                path: "create-faculty",
                element: "<CreateFaculty />",
              },
              {
                name:'Create Admin',
                path: "create-admin",
                element: "<CreateAdmin />",
              },
        ]
    }
   
  ];

  const newArray = adminRoutes.reduce((acc, item)=>{
    if(item.path && item.element){
        acc.push({
            key: item.name,
            label:'NavLink'

        })
    }

    if(item.children){
            acc.push({
                key: item.name,
                label: item.name,
                children:item.children.map(child=>({
                    key:child.name,
                    label:'NavLink'
                }))
            })
     
    }
    return acc
  },[])

  console.log(JSON.stringify(newArray).pre)