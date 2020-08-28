const mongoose=require('mongoose')
module.exports=new mongoose.Schema({
    category:String,           // 内容分类
    tags:Array,                // 内容的标签
    title:String,              // 文章的标题
    description:String,        // 文章简述
    view:{                     // 文章的观看次数
      type:Number,
      default:0
    },     
    comments:{                  // 文章的评论
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    },          
    createTime:{               // 文档创建的时间
        type:Date,
        default:Date.now()
    },
    updateTime:{               // 更新时间
        type:Date,
        default:Date.now()
    },
    user:{                     // 文章的作者
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    html:{                  // 文章的具体内容
        type:String
    } 
},{
    versionKey:false,
    timestamps:{createdAt:'createTime',updatedAt:'updateTime'}
})