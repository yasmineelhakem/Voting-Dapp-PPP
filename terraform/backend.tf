terraform { 
  backend "remote" { 
    
    organization = "ppp_cc" 

    workspaces { 
      name = "voting-dapp" 
    } 
  } 
}