const app = Vue.createApp({
    data: function () {
        return {
            statuses: [
                { subject: "all", value: "" },
                { subject: "Draft", value: "Draft" },
                { subject: "Pending", value: "Pending" },
                { subject: "Paid", value: "Paid" },
            ],
            options: [
                { subject: "Draft", value: "Draft" },
                { subject: "Pending", value: "Pending" },
                { subject: "Paid", value: "Paid" },
            ],
            filter: "all",
            invoices: [],
            number: "",
            client: "",
            amount: "",
            status: "Draft",
        }
    },
    computed: {
        allInvoices: function () {
            let status = this.filter;
            if (status === "all") return this.invoices;
            return this.invoices.filter((invoice) => invoice.status === status);
        },
    },
    methods: {
        saveData: function (data) {
            this.invoices = this.invoices.map((invoice) => {
                if (invoice.number === data.number) {
                    invoice.status = data.status;
                    invoice.client = data.client;
                    invoice.amount = data.amount;
                }
                return invoice;
            });
            localStorage.invoices = JSON.stringify(this.invoices);
        },
        deleteData: function (data) {
            this.invoices = this.invoices.filter((invoice) => invoice.number !== data.number);
            localStorage.invoices = JSON.stringify(this.invoices);
        },
        createInvoice: function () {
            if (this.client !== "" && this.amount !== "") {
                const newInvoice = {
                    number: this.makeSerial(6),
                    client: this.client,
                    amount: this.amount,
                    status: this.status
                }
                console.log(newInvoice)
                this.invoices.push(newInvoice)
                localStorage.invoices = JSON.stringify(this.invoices);
            }
        },
        makeSerial: function (length) {
            const numbers = []
            for (let i = 0; i < length; i++) {
                const randomNumber = Math.floor(Math.random() * (100 - 68)) + 68
                numbers.push(String.fromCharCode(randomNumber))
            }
            return numbers.join('')
        },
        changeAble: function () {
            this.isUpdatable = !this.isUpdatable;
        },
    },
    mounted() {
        this.invoices = localStorage.invoices
            ? JSON.parse(localStorage.invoices)
            : invoices;
    },
})

app.component('table-header', {
    template: `
        <table class="table table-bordered" style="background-color: grey">
            <tr>
                <td width="20%">Invoice Number</td>
                <td width="20%">Invoice Client</td>
                <td width="25%">Invoice Amount</td>
                <td width="15%">Invoice Status</td>
                <td width="20%">Inovice Handle</td>
            </tr>        
        </table>
    `
})

app.component('invoice-list', {
    props: {
        invoice: {
            type: Object,
            required: true,
            default: () => ({}),
        },
    },
    data: function () {
        return {
            isUpdatable: false,
            updateNum: '',
            updateClient: '',
            updateAmount: '',
            updateStatus: 'Draft',
            options: [
                { subject: "Draft", value: "Draft" },
                { subject: "Pending", value: "Pending" },
                { subject: "Paid", value: "Paid" },
            ],
        }
    },
    methods: {
        saveData: function () {
            const updateInv = {
                number: this.updateNum,
                client: this.updateClient,
                amount: this.updateAmount,
                status: this.updateStatus,
            }
            this.$emit('save-data', updateInv)
            this.isUpdatable = false;
        },
        deleteData: function () {
            const updateInv = {
                number: this.updateNum,
                client: this.updateClient,
                amount: this.updateAmount,
                status: this.updateStatus,
            }
            this.$emit('delete-data', updateInv)
            this.isUpdatable = false;
        },
        changeAble: function () {
            this.isUpdatable = !this.isUpdatable;
        },
    },
    mounted() {
        this.updateNum = this.invoice.number;
        this.updateClient = this.invoice.client;
        this.updateAmount = this.invoice.amount;
        this.updateStatus = this.invoice.status;
    },
    template: `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <tr>
                    <td width="20%">
                        #{{ invoice.number }}
                    </td>
                    <td width="20%">
                        {{ invoice.client }}
                    </td>
                    <td width="25%">
                        $ {{ invoice.amount }}
                    </td>
                    <td :class="[
                        invoice.status === 'Pending' ? 'pending' : '',
                        invoice.status === 'Draft' ? 'draft' : '',
                        invoice.status === 'Paid' ? 'paid' : '',
                        ]" width="15%">
                        {{ invoice.status }}
                    </td>
                    <td width="20%">
                        <button class="btn btn-primary edit" v-show="!isUpdatable" @click="changeAble">
                        edit
                        </button>
                        <button class="btn btn-danger" v-show="!isUpdatable" @click="deleteData">Delete</button>
                        <button class="btn btn-primary edit" v-show="isUpdatable" @click="changeAble">close</button>
                    </td>
                </tr>
            </table>
            <div class="invoice-edit mt-3 p-5" v-show="isUpdatable">
                <form class="w-70">
                    <div class="form-group">
                        <label>Client:</label>
                        <input type="text" class="form-control" v-model="updateClient" />
                    </div>
                    <div class="form-group">
                        <label>Status:</label>                        
                        <select class="form-control" v-model='updateStatus'>
                            <option v-for="status in options" :key="status.subject">
                            {{ status.subject }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Amount:</label>
                        <input type="text" class="form-control" v-model="updateAmount" />
                    </div>
                    <div class="form-action">
                        <button class="btn btn-primary" @click="saveData">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `
})



const vm = app.mount('#app')

