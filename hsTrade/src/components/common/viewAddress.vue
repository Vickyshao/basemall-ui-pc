<template>
    <span>{{addr}}</span>
</template>
<script>
export default {
    /**
     * @param {address, type}
     * address为传入的地址
     * type为输出类型,p省,c市,d区
     */
    props:['options'],
    computed:{
        addr(){
            let addr=this.options.address||'';
            if(addr){
                let addrData=JSON.parse(localStorage.getItem('addrData'));
                let arr=addr.split('-');
                if(arr[0]&&!isNaN(arr[0]*1)){
                    let [p,c,d]=arr,
                        province=addrData['0'][p],
                        city=addrData[`0,${p}`][c],
                        district=addrData[`0,${p},${c}`][d];

                    addr=[province,city,district].join('-')
                }
            };
            if(this.options.type=='p'){
                addr=addr.split('-')[0]
            }else if(this.options.type=='c'){
                addr=addr.split('-')[1]
            }else if(this.options.type=='d'){
                addr=addr.split('-')[2]
            };
            return addr
        }
    }
}
</script>
