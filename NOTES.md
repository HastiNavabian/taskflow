<div dir="rtl">

onMutate: async ({ id, newStatus }) => {...} — این تابع قبل از اینکه
mutationFn (یعنی خود fetch) حتی شروع بشه، اجرا می‌شه.<br />
queryClient.cancelQueries({ queryKey: ["tasks"] }) — اگه یه fetch دیگه
از ["tasks"] هنوز در حال اجراست (مثلاً یه refetch خودکار)، لغوش می‌کنیم.
چرا؟ برای جلوگیری از race condition: اگه اون fetch قدیمی بعد از
optimistic update ما جواب بده، ممکنه دیتای قدیمی رو بی‌موقع جایگزین کنه
و تغییر optimistic ما رو خراب کنه. <br />
queryClient.getQueryData(["tasks"]) — معادل const previousTasks = tasks
قبلی؛ مقدار فعلی cache رو می‌گیریم تا اگه لازم شد برگردونیم. <br />
queryClient.setQueryData(["tasks"], (old) => ...) — این دقیقاً معادل
setTasks((prev) => ...) قبلیه، ولی به‌جای state لوکال React، مستقیم
cache خود TanStack Query رو تغییر می‌ده. چون UI از همین cache می‌خونه
(یادته useQuery از همینجا data رو برمی‌گردونه)، تغییر فوری تو UI منعکس
می‌شه. return { previousTasks } — هر چیزی که از onMutate برگردونی،
به‌عنوان context به onError و onSettled پاس داده می‌شه. این‌جوریه که
onError می‌تونه بفهمه مقدار قبلی چی بود. onError: (err, variables,
context) => {...} — اگه mutationFn خطا بده (fetch fail بشه)، این اجرا
می‌شه. context.previousTasks همون چیزیه که تو onMutate برگردوندیم — با
setQueryData دوباره برمی‌گردونیمش، یعنی rollback. onSettled — چه موفق
بشه چه fail بشه، در نهایت یه invalidateQueries می‌زنیم تا مطمئن بشیم
دیتای cache دقیقاً با سرور sync هست (نه فقط optimistic guess ما). سؤال
چالشی قبل از رفتن سراغ addTask/deleteTask: چرا تو onMutate از
queryClient.setQueryData استفاده کردیم به‌جای اینکه صبر کنیم و تو
onSuccess این کارو کنیم؟ (اشاره: کلمه‌ی "optimistic" یعنی "خوش‌بینانه" —
خوش‌بینانه نسبت به چی، و این تغییر باید کِی دقیقاً اتفاق بیفته که اسمش
optimistic باشه؟)

</p>

</div>
